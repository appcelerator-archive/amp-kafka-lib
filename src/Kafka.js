import { Client } from 'kafka-node'
import EventEmitter from 'events'

export default class Kafka extends EventEmitter {
  constructor(options) {
    super()

    // TODO fix esformatter when there is time
    /* eslint-disable babel/object-curly-spacing */
    let {connectionString, clientId, zkOptions, noAckBatchOptions} = options
    this.client = new Client(connectionString, clientId, zkOptions, noAckBatchOptions)
  }
}
