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
var staticServer = require('../lib/services/staticServer');

describe('staticServer', function() {
  var mockRequest;
  var mockResponse;

  beforeEach(function(done) {
    mockRequest = {
      url: '/blah.html'
    };

    mockResponse = {
      writeHead: simple.mock(),
      end: simple.mock()
    };

    done();
  });

  describe('serve()', function() {

    it('should handle a file that does not exist', function(done) {

      staticServer.serve(mockRequest, mockResponse, done);

      setTimeout(function() {

        expect(mockResponse.writeHead.callCount).equals(1);
        expect(mockResponse.writeHead.lastCall.arg).equals(404);
        expect(mockResponse.end.callCount).equals(1);

        done();
      }, 1000);
    });

    it('should sanitize file path', function(done) {

      mockRequest.url = '/../package.json';

      staticServer.serve(mockRequest, mockResponse, done);

      setTimeout(function() {

        expect(mockResponse.writeHead.callCount).equals(1);
        expect(mockResponse.writeHead.lastCall.arg).equals(404);
        expect(mockResponse.end.callCount).equals(1);

        done();
      }, 1000);
    });

    it('should serve an existing file', function(done) {

      mockRequest.url = '/monitor.html';

      staticServer.serve(mockRequest, mockResponse, done);

      setTimeout(function() {

        expect(mockResponse.writeHead.callCount).equals(1);
        expect(mockResponse.writeHead.lastCall.arg).equals(200);
        expect(mockResponse.writeHead.lastCall.args[1]).exists();
        expect(mockResponse.writeHead.lastCall.args[1]['content-type']).equals('text/html');
        expect(mockResponse.end.callCount).equals(1);
        expect(mockResponse.end.lastCall.arg).exists();
        expect(mockResponse.end.lastCall.arg.length).above(1000);

        done();
      }, 1000);
    });
  });
});
