module.exports = {
  // name: 'acb123', // Default: `msb.serviceDetails.name`
  routes: [{
    bus: {
      topic: 'abc:123'
    },
    http: {
      methods: ['get'],
      path: '/abc'
    }
  }]
};
