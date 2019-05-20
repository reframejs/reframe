module.exports = {
  $plugins: [
    require('@reframe/react-kit'),
  ]
};

module.exports['serverEntryFile'] = require.resolve('./server/start.js');
