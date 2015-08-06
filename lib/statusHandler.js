var msb = require('msb');
var config = require('../config');
var channelMonitor = require('./services/channelMonitor');
// var payloadSchema = require('../schemas/routes');

var handler = msb.Responder.createServer({
  namespace: '_app:' + config.name + ':status'
})
// .use(msb.validateWithSchema.middleware(payloadSchema))
.use(function(req, res, next) {

  var docs = (req.query && req.query.topic) ? channelMonitor.statusForTopic(req.query.topic) : channelMonitor.statusForAll();

  res.writeHead(200);
  res.end({
    docs: docs
  });
});

// Start if this module is loaded first
if (!module.parent) { handler.listen(); }

module.exports = handler;
