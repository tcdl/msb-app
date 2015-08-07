var _ = require('lodash');
var http2bus = require('msb-http2bus');

var routes = exports;

var agent;

routes.findForTopic = function(topic) {
  return _.select(agent.routes, function(route) {
    return route.bus && route.bus.topic === topic;
  });
};

routes.findAll = function() {
  return agent.routes;
};

routes.load = function(config) {
  agent = http2bus.createRoutesProviderAgent(config);
};
