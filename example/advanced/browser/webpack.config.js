const {Config, StandardConfig} = require('@rebuild/config');
//const {ReframeConfig} = require('@reframe/build');
const pages = require('../pages');

const config = new Config();

config.add([
    new StandardConfig({
        entry: require.resolve('./src'),
    }),
    /*
    new ReframeConfig({
        pages,
    }),
    */
]);

const webpackConfig = config.assemble({log: true});

module.exports = webpackConfig;
