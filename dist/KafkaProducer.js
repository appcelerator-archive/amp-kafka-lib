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

var KafkaProducer = function (_Kafka) {
  _inherits(KafkaProducer, _Kafka);

  function KafkaProducer(clientOptions, producerOptions) {
    _classCallCheck(this, KafkaProducer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(KafkaProducer).call(this, clientOptions));

    _this.producer = new _kafkaNode.HighLevelProducer(_this.client, producerOptions);

    // promisify client close
    _this.closeAsync = (0, _bluebird.promisify)(_this.client.close);

    // promisify producer functions
    _this.producer.closeAsync = (0, _bluebird.promisify)(_this.producer.close);
    _this.producer.createTopicsAsync = (0, _bluebird.promisify)(_this.producer.createTopics);
    _this.producer.sendAsync = (0, _bluebird.promisify)(_this.producer.send);

    // delegate producer events
    var events = ['ready', 'error'];
    events.forEach(function (event) {
      _this.producer.on(event, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this.emit.apply(_this, [event].concat(args));
      });
    });
    return _this;
  }

  _createClass(KafkaProducer, [{
    key: 'close',
    value: function close() {
      return regeneratorRuntime.async(function close$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.producer.closeAsync());

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'createTopic',
    value: function createTopic(topic) {
      return regeneratorRuntime.async(function createTopic$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(this.createTopics([topic]));

            case 2:
              return _context2.abrupt('return', _context2.sent);

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'createTopics',
    value: function createTopics(topics) {
      return regeneratorRuntime.async(function createTopics$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.producer.createTopicsAsync(topics, true));

            case 2:
              return _context3.abrupt('return', _context3.sent);

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, null, this);
    }

    // see: https://github.com/SOHU-Co/kafka-node#sendpayloads-cb-1

  }, {
    key: 'send',
    value: function send(payloads) {
      return regeneratorRuntime.async(function send$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return regeneratorRuntime.awrap(this.producer.sendAsync(payloads));

            case 2:
              return _context4.abrupt('return', _context4.sent);

            case 3:
            case 'end':
              return _context4.stop();
          }
        }
      }, null, this);
    }

    // see: https://github.com/SOHU-Co/kafka-node#sendpayloads-cb-1

  }, {
    key: 'sendMessage',
    value: function sendMessage(topic, message, key, attributes) {
      var payloads;
      return regeneratorRuntime.async(function sendMessage$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              payloads = [{
                topic: topic,
                messages: message
              }];


              if (key) {
                payloads.key = key;
              }

              if (attributes) {
                payloads.attributes = attributes;
              }

              _context5.next = 5;
              return regeneratorRuntime.awrap(this.send(payloads));

            case 5:
              return _context5.abrupt('return', _context5.sent);

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: 'waitReady',
    value: function waitReady() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.producer.on('ready', resolve);
        _this2.producer.on('error', reject);
      });
    }
  }]);

  return KafkaProducer;
}(_Kafka3.default);

exports.default = KafkaProducer;