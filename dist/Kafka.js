'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _kafkaNode = require('kafka-node');

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Kafka = function (_EventEmitter) {
  _inherits(Kafka, _EventEmitter);

  function Kafka(options) {
    _classCallCheck(this, Kafka);

    // TODO fix esformatter when there is time
    /* eslint-disable babel/object-curly-spacing */

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Kafka).call(this));

    var connectionString = options.connectionString;
    var clientId = options.clientId;
    var zkOptions = options.zkOptions;
    var noAckBatchOptions = options.noAckBatchOptions;

    _this.client = new _kafkaNode.Client(connectionString, clientId, zkOptions, noAckBatchOptions);
    return _this;
  }

  return Kafka;
}(_events2.default);

exports.default = Kafka;