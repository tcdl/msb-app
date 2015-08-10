var _ = require('lodash');
var msb = require('msb');

var channelMonitor = exports;
var monitoredTopics;
var monitoringOptions;

channelMonitor.statusForAll = function() {
  var infoByTopic = msb.channelMonitor.doc.infoByTopic;
  return _.select(infoByTopic, function(value, key) {
    var foundStatus = _.find(monitoredTopics, function(topic) {
      return key === topic || (
        key.indexOf(topic) === 0 &&
        key.slice(topic.length).match(/(:response)?:[a-f0-9]+/));
    });
    if (!foundStatus) return;

    value.namespace = key;
    value.consumersCount = value.consumers.length;
    value.producersCount = value.producers.length;
    delete(value.consumedCount);
    delete(value.producedCount);
    return true;
  });
};

channelMonitor.statusForTopic = function(topic) {
  var isMonitoredTopic = _.find(monitoredTopics, function(monitoredTopic) {
    return topic === monitoredTopic || (
      topic.indexOf(monitoredTopic) === 0 &&
      topic.slice(monitoredTopic.length).match(/(:response)?:[a-f0-9]+/));
  });
  if (!isMonitoredTopic) return [];

  var infoByTopic = msb.channelMonitor.doc.infoByTopic;
  return _.select(infoByTopic, function(value, key) {
    var foundStatus = (key === topic || (
      key.indexOf(topic) === 0 &&
      key.slice(topic.length).match(/(:response)?:[a-f0-9]+/)));
    if (!foundStatus) return;

    value.namespace = key;
    value.consumersCount = value.consumers.length;
    value.producersCount = value.producers.length;
    delete(value.consumedCount);
    delete(value.producedCount);
    return true;
  });
};

channelMonitor.start = function(topics) {
  monitoredTopics = topics;
  msb.channelMonitor.start();
};
