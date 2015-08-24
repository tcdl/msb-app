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
  var staticHandler = require('./lib/staticHandler');

  addRoutes(config.routes, routesHandler.config.namespace, '/routes');
  addRoutes(config.routes, statusHandler.config.namespace, '/status');

  config.routes.push({
    bus: {
      namespace: staticHandler.config.namespace,
      waitForResponses: 1
    },
    http: {
      remote: true,
      path: '/_app'
    }
  });

  routes.load(config);

  routesHandler.listen();
  statusHandler.listen();
  staticHandler.listen();

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
