/* Setup */
var Lab = require('lab');
var Code = require('code');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var beforeEach = lab.beforeEach;
var after = lab.after;
var afterEach = lab.afterEach;
var expect = Code.expect;

/* Modules */
var simple = require('simple-mock');
var msb = require('msb');
var ResponderServer = require('msb/lib/responderServer');
var channelMonitor = require('../lib/services/channelMonitor');
var routes = require('../lib/services/routes');
var config = require('../config');
var app = require('../app');

describe('app', function() {
  afterEach(function(done) {
    simple.restore();

    done();
  });

  describe('start()', function() {
    beforeEach(function(done) {

      simple.mock(msb, 'configure').returnWith();
      simple.mock(channelMonitor, 'start').returnWith();
      simple.mock(routes, 'load').returnWith();
      simple.mock(ResponderServer.prototype, 'listen').returnWith();

      done();
    });

    it('should validate the app config', function(done) {
      simple.mock(config, 'ttl', 'ble');

      var err;
      try {
        app.start();
      } catch (e) {
        err = e;
      }

      expect(err).exists();
      done();
    });

    it('should validate the app config and start stuff', function(done) {
      simple.mock(config, 'name', 'something');
      simple.mock(config, 'routes', [
        {
          provider: {
            name: 'zzz'
          },
          http: {

          }
        },
        {
          bus: {
            namespace: 'abc:def'
          },
          http: {

          }
        }
      ]);

      app.start();

      expect(channelMonitor.start.callCount).equals(1);
      expect(channelMonitor.start.lastCall.arg).exists();
      expect(channelMonitor.start.lastCall.arg.join()).equals('abc:def');

      expect(routes.load.callCount).equals(1);
      expect(routes.load.lastCall.arg).equals(config);

      expect(ResponderServer.prototype.listen.callCount).equals(2);
      expect(config.routes.length).equals(4);

      done();
    });
  });
});
