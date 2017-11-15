const path = require('path'):
const {Config, StandardConfig} = require('@rebuild/config');
const {StandardReframeConfig} = require('@reframe/build');

const config = new Config();

config.add([
    new StandardConfig({
        entry: require.resolve('./src'),
    }),
    new StandardReframeConfig({
        pages: path.join(__dirname, '../pages'),
    }),
]);

const webpackConfig = config.assemble({log: true});

module.exports = webpackConfig;
