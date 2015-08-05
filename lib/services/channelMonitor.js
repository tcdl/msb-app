var _ = require('lodash');
var msb = require('msb');

var channelMonitor = exports;
var monitoredTopics;
var monitoringOptions;

channelMonitor.statusForAll = function() {
  var infoByTopic = msb.channelMonitor.doc.infoByTopic;
  return _.select(infoByTopic, function(value, key) {
    return _.find(monitoredTopics, function(topic) {
      return key === topic || (
        key.indexOf(topic) === 0 &&
        key.slice(topic.length).match(/(:response)?:[a-f0-9]+/));
    });
  });
};

channelMonitor.statusForTopic = function(topic) {
  var infoByTopic = msb.channelMonitor.doc.infoByTopic;
  return _.select(msb.channelMonitor.doc, function(value, key) {
    return key === topic || (
      key.indexOf(topic) === 0 &&
      key.slice(topic.length).match(/(:response)?:[a-f0-9]+/));
  });
};

channelMonitor.start = function(topics) {
  monitoredTopics = topics;
  msb.channelMonitor.start();
};
