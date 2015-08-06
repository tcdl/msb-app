var crypto = require('crypto');
var _ = require('lodash');
var InfoCenterAgent = require('msb/lib/infoCenterAgent');
var routes = exports;
var infoCenterAgent;
var loadedRoutes;

routes.findForTopic = function(topic) {
  return _.select(loadedRoutes, function(route) {
    return route.bus && route.bus.topic === topic;
  });
};

routes.findAll = function() {
  return loadedRoutes;
};

routes.load = function(config) {
  var name = config.name;
  var routes = config.routes;

  infoCenterAgent = new InfoCenterAgent({
    announceNamespace: '_http2bus:routes:announce',
    heartbeatsNamespace: '_http2bus:routes:heartbeat'
  });

  // Insert application name tag
  _.each(routes, function(route) {
    if (route.bus.tags) {
      route.bus.tags.push(name);
    } else {
      route.bus.tags = [name];
    }
  });

  var routesHash = md5(JSON.stringify(routes) + config.ttl);

  infoCenterAgent.doc = {
    name: name,
    ttl: config.ttl,
    versionHash: routesHash,
    routes: routes
  };

  loadedRoutes = routes;
  infoCenterAgent.doBroadcast();
  infoCenterAgent.start();
};

function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}
