// disable for mocha tests
/* eslint-disable no-invalid-this */
/* eslint-disable no-console */

import 'source-map-support/register'
import { KafkaConsumer, KafkaProducer } from '..'
import assert from 'assert'
import pkg from '../../package.json'

before(function(done) {
  let wait = 30 * 1000
  let timeout = wait + 1000
  this.timeout(timeout)

  console.log(`test will wait for ${wait / 1000} seconds to give services time to finish initializing`)
  setTimeout(() => {
    console.log('starting tests')
    done()
  }, wait)
})

describe('kafka tests', function() {
  let topic = 'amp-service-start'
  let message = 'hello'
  let options = {
    connectionString: 'zookeeper:2181',
    clientId: pkg.name
  }

  it('should send and receive a message', async function() {
    this.timeout(10 * 1000)
    let producer = new KafkaProducer(options)

    await producer.waitReady()
    assert(producer.producer.ready)
    let result = await producer.createTopic(topic)
    assert.equal(result, 'All requests sent')

    await producer.sendMessage(topic, message)
    await producer.close()

    let payloads = [{
      topic: topic
    }]
    let consumer = new KafkaConsumer(payloads, options)
    let received = await consumer.waitMessage()
    assert.equal(received.topic, topic)
    assert.equal(received.value, message)
    await consumer.close()
  })
})
