import redisRedirect from './redis-redirect/index.js';

export default function (config = {}) {
  const apiEndpoints = Object.keys(config).map((key) => {
    return [redisRedirect(key, config[key]), { prefix: `/${key}` }];
  });

  return function (app, opts, done) {
    // Deploy all routes
    apiEndpoints.forEach(function (endpoint) {
      app.register(...endpoint);
    });

    app.get('/', function (req, res) {
      return { hello: 'api' };
    });

    done();
  };
}
