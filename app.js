var _ = require('lodash');
var msb = require('msb');
var app = exports;
var config = require('./config');
var channelMonitor = require('./lib/services/channelMonitor');
var routes = require('./lib/services/routes');
var configSchema = require('./schemas/config');

app.start = function(cb) {
  if (!config.name) config.name = msb.serviceDetails.name;
  msb.validateWithSchema(configSchema, config);

  var topicsToMonitor = _.filter(_.uniq(_.pluck(config.routes, 'bus.namespace')));
  channelMonitor.start(topicsToMonitor);

  var routesHandler = require('./lib/routesHandler');
  var statusHandler = require('./lib/statusHandler');

  addRoutes(config.routes, routesHandler.config.namespace, '/routes');
  addRoutes(config.routes, statusHandler.config.namespace, '/status');

  routes.load(config);

  routesHandler.listen();
  statusHandler.listen();

  console.log(config.name + ' started');
};

function addRoutes(routes, topic, suffix) {
  routes.push({
    bus: {
      namespace: topic,
      waitForResponses: 1
    },
    http: {
      methods: ['get'],
      path: '/_app' + suffix
    }
  });
}
