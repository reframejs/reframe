const Rebuild = require('@rebuild/config');
const Reframe = require('@reframe/build');

const config = new Rebuild.config.Config();

config.add([
    new Rebuild.config.StandardConfig({
        entry: require.resolve('./src'),
    }),
    new Reframe.build.StandardConfig({
        pages: require.resolve('../pages'),
    }),
]);

const webpackConfig = config.compile({log: true});

module.exports = webpackConfig;
