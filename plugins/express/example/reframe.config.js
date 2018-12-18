const koaServer = require('@reframe/koa');

module.exports = {
  $plugins: [
    require('@reframe/react-kit'),
    require('@reframe/express')
  ]
};

module.exports['serverStartFile'] = require.resolve('./server/start.js');
