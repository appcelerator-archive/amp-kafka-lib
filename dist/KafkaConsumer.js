'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _kafkaNode = require('kafka-node');

var _Kafka2 = require('./Kafka');

var _Kafka3 = _interopRequireDefault(_Kafka2);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var KafkaConsumer = function (_Kafka) {
  _inherits(KafkaConsumer, _Kafka);

  function KafkaConsumer(payloads, options, consumerGroup) {
    _classCallCheck(this, KafkaConsumer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KafkaConsumer).call(this, options));

    _this.consumer = new _kafkaNode.HighLevelConsumer(_this.client, payloads, {
      autoCommit: true,
      groupId: consumerGroup
    });

    // promisify consumer functions
    // manually promisify addTopics because callback is in the middle of the params list
    _this.addTopicsAsync = function (topics, fromOffset) {
      return new Promise(function (resolve, reject) {
        _this.consumer.addTopics(topics, function (err, added) {
          if (err) return reject(err);
          return resolve(added);
        }, fromOffset);
      });
    };
    _this.consumer.removeTopicsAsync = (0, _bluebird.promisify)(_this.consumer.removeTopics);
    _this.consumer.commitAsync = (0, _bluebird.promisify)(_this.consumer.commit);
    _this.consumer.closeAsync = (0, _bluebird.promisify)(_this.consumer.close);

    // delegate consumer events
    var events = ['message', 'error', 'offsetOutOfRange'];
    events.forEach(function (event) {
      _this.consumer.on(event, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this.emit.apply(_this, [event].concat(args));
      });
    });
    return _this;
  }

  _createClass(KafkaConsumer, [{
    key: 'addTopics',
    value: function addTopics(topics) {
      return regeneratorRuntime.async(function addTopics$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.createTopicsAsync(topics, true));

            case 2:
              return _context.abrupt('return', _context.sent);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'close',
    value: function close(force) {
      return regeneratorRuntime.async(function close$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(this.consumer.closeAsync(force));

            case 2:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'commit',
    value: function commit() {
      return regeneratorRuntime.async(function commit$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.consumer.commitAsync());

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'pause',
    value: function pause() {
      this.consumer.pause();
    }

    /**
     * topics: https://github.com/SOHU-Co/kafka-node#removetopicstopics-cb-1
     */

  }, {
    key: 'removeTopics',
    value: function removeTopics(topics) {
      return regeneratorRuntime.async(function removeTopics$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.consumer.removeTopicsAsync(topics));

            case 2:
              return _context4.abrupt('return', _context4.sent);

            case 3:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'resume',
    value: function resume() {
      this.consumer.resume();
    }

    /**
     * offset: https://github.com/SOHU-Co/kafka-node#offset
     */

  }, {
    key: 'setOffset',
    value: function setOffset(topic, partition, offset) {
      this.consumer.setOffset(topic, partition, offset);
    }
  }, {
    key: 'waitMessage',
    value: function waitMessage() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.consumer.on('message', resolve);
        _this2.consumer.on('error', reject);
        _this2.consumer.on('offsetOutOfRange', reject);
      });
    }
  }]);

  return KafkaConsumer;
}(_Kafka3.default);

exports.default = KafkaConsumer;