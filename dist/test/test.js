'use strict';

require('babel-polyfill');

require('source-map-support/register');

var _ = require('..');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

before(function (done) {
  var wait = 9 * 1000;
  var timeout = wait + 1000;
  this.timeout(timeout);

  console.log('test will wait for ' + wait / 1000 + ' seconds to give services time to finish initializing');
  setTimeout(function () {
    console.log('starting tests');
    done();
  }, wait);
}); // disable for mocha tests
/* eslint-disable no-invalid-this */
/* eslint-disable no-console */

describe('kafka tests', function () {
  var topic = 'service-start';
  var message = 'hello';
  var options = {
    connectionString: 'zookeeper:2181',
    clientId: _package2.default.name
  };

  it('should send and receive a message', function _callee() {
    var producer, result, payloads, consumer, received;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.timeout(10 * 1000);
            producer = new _.KafkaProducer(options);
            _context.next = 4;
            return regeneratorRuntime.awrap(producer.waitReady());

          case 4:
            (0, _assert2.default)(producer.producer.ready);
            _context.next = 7;
            return regeneratorRuntime.awrap(producer.createTopic(topic));

          case 7:
            result = _context.sent;

            _assert2.default.equal(result, 'All requests sent');

            _context.next = 11;
            return regeneratorRuntime.awrap(producer.sendMessage(topic, message));

          case 11:
            _context.next = 13;
            return regeneratorRuntime.awrap(producer.close());

          case 13:
            payloads = [{
              topic: topic
            }];
            consumer = new _.KafkaConsumer(payloads, options);
            _context.next = 17;
            return regeneratorRuntime.awrap(consumer.waitMessage());

          case 17:
            received = _context.sent;

            _assert2.default.equal(received.topic, topic);
            _assert2.default.equal(received.value, message);
            _context.next = 22;
            return regeneratorRuntime.awrap(consumer.close());

          case 22:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this);
  });
});