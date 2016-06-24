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

class KafkaConsumer extends _Kafka2.default {

  constructor(payloads, options, consumerGroup) {
    super(options);

    this.consumer = new _kafkaNode.HighLevelConsumer(this.client, payloads, {
      autoCommit: true,
      groupId: consumerGroup
    });

    // promisify consumer functions
    // manually promisify addTopics because callback is in the middle of the params list
    this.addTopicsAsync = (topics, fromOffset) => {
      return new Promise((resolve, reject) => {
        this.consumer.addTopics(topics, (err, added) => {
          if (err) return reject(err);
          return resolve(added);
        }, fromOffset);
      });
    };
    this.consumer.removeTopicsAsync = (0, _bluebird.promisify)(this.consumer.removeTopics);
    this.consumer.commitAsync = (0, _bluebird.promisify)(this.consumer.commit);
    this.consumer.closeAsync = (0, _bluebird.promisify)(this.consumer.close);

    // delegate consumer events
    let events = ['message', 'error', 'offsetOutOfRange'];
    events.forEach(event => {
      this.consumer.on(event, (...args) => {
        this.emit(event, ...args);
      });
    });
  }

  addTopics(topics) {
    var _this = this;

    return _asyncToGenerator(function*() {
      return yield _this.createTopicsAsync(topics, true);
    })();
  }

  close(force) {
    var _this2 = this;

    return _asyncToGenerator(function*() {
      yield _this2.consumer.closeAsync(force);
    })();
  }

  commit() {
    var _this3 = this;

    return _asyncToGenerator(function*() {
      yield _this3.consumer.commitAsync();
    })();
  }

  pause() {
    this.consumer.pause();
  }

  /**
   * topics: https://github.com/SOHU-Co/kafka-node#removetopicstopics-cb-1
   */
  removeTopics(topics) {
    var _this4 = this;

    return _asyncToGenerator(function*() {
      return yield _this4.consumer.removeTopicsAsync(topics);
    })();
  }

  resume() {
    this.consumer.resume();
  }

  /**
   * offset: https://github.com/SOHU-Co/kafka-node#offset
   */
  setOffset(topic, partition, offset) {
    this.consumer.setOffset(topic, partition, offset);
  }

  waitMessage() {
    return new Promise((resolve, reject) => {
      this.consumer.on('message', resolve);
      this.consumer.on('error', reject);
      this.consumer.on('offsetOutOfRange', reject);
    });
  }
}
exports.default = KafkaConsumer;
//# sourceMappingURL=KafkaConsumer.js.map