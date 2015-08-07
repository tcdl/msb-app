module.exports = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      pattern: '[a-z0-9\\-]+',
      minLength: 1
    },
    ttl: {
      type: ['number', 'null']
    },
    routes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          bus: {
            type: 'object',
            properties: {
              namespace: {
                type: 'string',
                pattern: '^_?([a-z0-9\-]+\:)+([a-z0-9\-]+)$'
              }
            },
            required: ['namespace']
          }
        }
      }
    }
  },
  required: ['name', 'routes']
};
