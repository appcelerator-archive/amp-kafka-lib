'use strict';

require('source-map-support/register');

var _ = require('..');

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

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
} // disable for mocha tests
/* eslint-disable no-invalid-this */
/* eslint-disable no-console */

before(function (done) {
  let wait = 9 * 1000;
  let timeout = wait + 1000;
  this.timeout(timeout);

  console.log(`test will wait for ${ wait / 1000 } seconds to give services time to finish initializing`);
  setTimeout(() => {
    console.log('starting tests');
    done();
  }, wait);
});

describe('kafka tests', function () {
  let topic = 'service-start';
  let message = 'hello';
  let options = {
    connectionString: 'zookeeper:2181',
    clientId: _package2.default.name
  };

  it('should send and receive a message', _asyncToGenerator(function*() {
    this.timeout(10 * 1000);
    let producer = new _.KafkaProducer(options);

    yield producer.waitReady();
    (0, _assert2.default)(producer.producer.ready);
    let result = yield producer.createTopic(topic);
    _assert2.default.equal(result, 'All requests sent');

    yield producer.sendMessage(topic, message);
    yield producer.close();

    let payloads = [{
      topic: topic
    }];
    let consumer = new _.KafkaConsumer(payloads, options);
    let received = yield consumer.waitMessage();
    _assert2.default.equal(received.topic, topic);
    _assert2.default.equal(received.value, message);
    yield consumer.close();
  }));
});
//# sourceMappingURL=test.js.map