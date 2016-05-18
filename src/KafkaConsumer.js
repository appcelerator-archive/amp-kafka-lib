import { HighLevelConsumer } from 'kafka-node';
import Kafka from './Kafka';
import { promisify } from 'bluebird';

export default class KafkaConsumer extends Kafka {

  constructor(payloads, options, consumerGroup) {
    super(options)

    this.consumer = new HighLevelConsumer(
      this.client,
      payloads,
      {
        autoCommit: true,
        groupId: consumerGroup
      }
    )

    // promisify consumer functions
    // manually promisify addTopics because callback is in the middle of the params list
    this.addTopicsAsync = (topics, fromOffset) => {
      return new Promise((resolve, reject) => {
        this.consumer.addTopics(topics, (err, added) => {
          if (err) return reject(err)
          return resolve(added)
        }, fromOffset)
      })
    }
    this.consumer.removeTopicsAsync = promisify(this.consumer.removeTopics)
    this.consumer.commitAsync = promisify(this.consumer.commit)
    this.consumer.closeAsync = promisify(this.consumer.close)

    // delegate consumer events
    let events = ['message', 'error', 'offsetOutOfRange']
    events.forEach(event => {
      this.consumer.on(event, (...args) => {
        this.emit(event, ...args)
      })
    })
  }

  async addTopics(topics) {
    return await this.createTopicsAsync(topics, true)
  }

  async close(force) {
    await this.consumer.closeAsync(force)
  }

  async commit() {
    await this.consumer.commitAsync()
  }

  pause() {
    this.consumer.pause()
  }

  /**
   * topics: https://github.com/SOHU-Co/kafka-node#removetopicstopics-cb-1
   */
  async removeTopics(topics) {
    return await this.consumer.removeTopicsAsync(topics)
  }

  resume() {
    this.consumer.resume()
  }

  /**
   * offset: https://github.com/SOHU-Co/kafka-node#offset
   */
  setOffset(topic, partition, offset) {
    this.consumer.setOffset(topic, partition, offset)
  }

  waitMessage() {
    return new Promise((resolve, reject) => {
      this.consumer.on('message', resolve)
      this.consumer.on('error', reject)
      this.consumer.on('offsetOutOfRange', reject)
    })
  }
}
