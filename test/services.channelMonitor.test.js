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
var channelMonitor = require('../lib/services/channelMonitor');

describe('service.channelMonitor', function() {

  beforeEach(function(done) {
    simple.mock(msb.channelMonitor, 'start').returnWith();
    done();
  });

  afterEach(function(done) {
    simple.restore();
    done();
  });

  it('can be started', function(done) {
    channelMonitor.start(['abc:123']);
    expect(msb.channelMonitor.start.callCount).equals(1);
    done();
  });

  describe('statusForAll()', function() {

    beforeEach(function(done) {

      channelMonitor.start(['abc:def', 'ghi:jkl']);
      msb.channelMonitor.doc.infoByTopic = {
        'red:white': {
        },
        'abc:def': {
          consumers: ['ccc'],
          consumedCount: 0,
          producers: ['ppp'],
          producedCount: 0
        },
        'abc:def:response:12345abc': {
          consumers: [],
          consumedCount: 1,
          producers: [],
          producedCount: 1
        }
      };
      done();
    });

    it('will return all infos for monitored topics', function(done) {

      var returned = channelMonitor.statusForAll();

      expect(returned.length).equals(2);
      expect(returned[0]).deep.equals({
        consumers: [
          'ccc'
        ],
        producers: [
          'ppp'
        ],
        namespace: 'abc:def',
        consumersCount: 1,
        producersCount: 1
      });

      done();
    });

    it('will return all infos for monitored topics', function(done) {

      var returned = channelMonitor.statusForTopic('abc:def');

      expect(returned.length).equals(2);
      expect(returned[0]).deep.equals({
        consumers: [
          'ccc'
        ],
        producers: [
          'ppp'
        ],
        namespace: 'abc:def',
        consumersCount: 1,
        producersCount: 1
      });

      done();
    });

    it('won\'t return for unmonitored topic', function(done) {

      var returned = channelMonitor.statusForTopic('red:white');

      expect(returned.length).equals(0);

      done();
    });
  });

});
