var _ = require('lodash');
var msb = require('msb');
var app = exports;
var config = require('./config');
var channelMonitor = require('./lib/services/channelMonitor');
var routes = require('./lib/services/routes');

app.start = function(cb) {
  msb.configure(config.bus);

  if (!config.name) config.name = msb.serviceDetails.name;

  var topicsToMonitor = _.uniq(_.pluck(config.routes, 'bus.namespace'));
  channelMonitor.start(topicsToMonitor);

  var routesHandler = require('./lib/routesHandler');
  var statusHandler = require('./lib/statusHandler');

  addRoutes(config.routes, routesHandler.config.namespace, '/routes');
  addRoutes(config.routes, statusHandler.config.namespace, '/status');

  routes.load(config.name, config.routes);

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
