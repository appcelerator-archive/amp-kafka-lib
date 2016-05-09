// disable for mocha test
/* eslint-disable no-invalid-this */

// TODO fix esformatter when there is time
/* eslint-disable babel/object-curly-spacing */

// TODO remove after debugging
/* eslint-disable no-console */

import 'babel-polyfill';
import 'source-map-support/register';

import { KafkaConsumer, KafkaProducer } from '..'
import assert from 'assert';
import pkg from '../../package.json'

describe('kafka tests', function() {
  let topic = 'service-start'
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

    let payloads = [{
      topic: topic
    }]
    let consumer = new KafkaConsumer(payloads, options)
    let received = await consumer.waitMessage()
    assert.equal(received.topic, topic)
    assert.equal(received.value, message)

    await producer.close()
  })
})
