import { HighLevelProducer } from 'kafka-node';
import Kafka from './Kafka';
import { promisify } from 'bluebird';

export default class KafkaProducer extends Kafka {

  constructor(clientOptions, producerOptions) {
    super(clientOptions)

    this.producer = new HighLevelProducer(this.client, producerOptions)

    // promisify client close
    this.closeAsync = promisify(this.client.close)

    // promisify producer functions
    this.producer.closeAsync = promisify(this.producer.close)
    this.producer.createTopicsAsync = promisify(this.producer.createTopics)
    this.producer.sendAsync = promisify(this.producer.send)

    // delegate producer events
    let events = ['ready', 'error']
    events.forEach(event => {
      this.producer.on(event, (...args) => {
        this.emit(event, ...args)
      })
    })
  }

  async close() {
    await this.producer.closeAsync()
  }

  async createTopic(topic) {
    return await this.createTopics([topic])
  }

  async createTopics(topics) {
    return await this.producer.createTopicsAsync(topics, true)
  }

  // see: https://github.com/SOHU-Co/kafka-node#sendpayloads-cb-1
  async send(payloads) {
    return await this.producer.sendAsync(payloads)
  }

  // see: https://github.com/SOHU-Co/kafka-node#sendpayloads-cb-1
  async sendMessage(topic, message, key, attributes) {
    let payloads = [{
      topic: topic,
      messages: message
    }]

    if (key) {
      payloads.key = key
    }

    if (attributes) {
      payloads.attributes = attributes
    }

    return await this.send(payloads)
  }

  waitReady() {
    return new Promise((resolve, reject) => {
      this.producer.on('ready', resolve)
      this.producer.on('error', reject)
    })
  }

}
