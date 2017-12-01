const {Config, StandardConfig, ReactConfig} = require('@rebuild/config');
const {RebuildConfig} = require('@reframe/core/build');

const config = new Config();

config.add([
    new StandardConfig({
        entry: require.resolve('./src'),
    }),
    new ReactConfig(),
    new RebuildConfig({
        pagesPath: require.resolve('../pages'),
    }),
]);

const webpackConfig = config.assemble({log: true});

//module.exports = [webpackConfig, webpackConfig];
module.exports = webpackConfig;
