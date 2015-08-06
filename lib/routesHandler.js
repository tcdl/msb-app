var msb = require('msb');
var config = require('../config');
var routes = require('./services/routes');

var handler = msb.Responder.createServer({
  namespace: '_app:' + config.name + ':routes'
})
.use(function(req, res, next) {

  var docs = (req.query && req.query.topic) ? routes.findForTopic(req.query.topic) : routes.findAll();

  res.writeHead(200);
  res.end({
    docs: docs
  });
});

// Start if this module is loaded first
if (!module.parent) { handler.listen(); }

module.exports = handler;
