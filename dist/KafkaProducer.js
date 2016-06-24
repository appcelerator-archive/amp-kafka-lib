'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kafkaNode = require('kafka-node');

var _Kafka = require('./Kafka');

var _Kafka2 = _interopRequireDefault(_Kafka);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) {
  return function() {
    var gen = fn.apply(this, arguments);
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }
        if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function(value) { return step("next", value); }, function(err) { return step("throw", err); }); }
      }

      return step("next");
    });
  };
}

class KafkaProducer extends _Kafka2.default {

  constructor(clientOptions, producerOptions) {
    super(clientOptions);

    this.producer = new _kafkaNode.HighLevelProducer(this.client, producerOptions);

    // promisify client close
    this.closeAsync = (0, _bluebird.promisify)(this.client.close);

    // promisify producer functions
    this.producer.closeAsync = (0, _bluebird.promisify)(this.producer.close);
    this.producer.createTopicsAsync = (0, _bluebird.promisify)(this.producer.createTopics);
    this.producer.sendAsync = (0, _bluebird.promisify)(this.producer.send);

    // delegate producer events
    let events = ['ready', 'error'];
    events.forEach(event => {
      this.producer.on(event, (...args) => {
        this.emit(event, ...args);
      });
    });
  }

  close() {
    var _this = this;

    return _asyncToGenerator(function*() {
      yield _this.producer.closeAsync();
    })();
  }

  createTopic(topic) {
    var _this2 = this;

    return _asyncToGenerator(function*() {
      return yield _this2.createTopics([topic]);
    })();
  }

  createTopics(topics) {
    var _this3 = this;

    return _asyncToGenerator(function*() {
      return yield _this3.producer.createTopicsAsync(topics, true);
    })();
  }

  // see: https://github.com/SOHU-Co/kafka-node#sendpayloads-cb-1
  send(payloads) {
    var _this4 = this;

    return _asyncToGenerator(function*() {
      return yield _this4.producer.sendAsync(payloads);
    })();
  }

  // see: https://github.com/SOHU-Co/kafka-node#sendpayloads-cb-1
  sendMessage(topic, message, key, attributes) {
    var _this5 = this;

    return _asyncToGenerator(function*() {
      let payloads = [{
        topic: topic,
        messages: message
      }];

      if (key) {
        payloads.key = key;
      }

      if (attributes) {
        payloads.attributes = attributes;
      }

      return yield _this5.send(payloads);
    })();
  }

  waitReady() {
    return new Promise((resolve, reject) => {
      this.producer.on('ready', resolve);
      this.producer.on('error', reject);
    });
  }

}
exports.default = KafkaProducer;
//# sourceMappingURL=KafkaProducer.js.map