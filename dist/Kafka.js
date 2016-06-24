'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kafkaNode = require('kafka-node');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Kafka extends _events2.default {
  constructor(options) {
    super();

    // TODO fix esformatter when there is time
    /* eslint-disable babel/object-curly-spacing */
    let { connectionString, clientId, zkOptions, noAckBatchOptions } = options;
    this.client = new _kafkaNode.Client(connectionString, clientId, zkOptions, noAckBatchOptions);
  }
}
exports.default = Kafka;
//# sourceMappingURL=Kafka.js.map