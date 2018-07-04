const koaServer = require('@reframe/koa');

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/koa')
    ]
};

module.exports['serverStartFile'] = require.resolve('./server/start.js');
