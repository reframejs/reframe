const {Config, StandardConfig, StandardNodeConfig, ReactConfig} = require('@rebuild/config');
const {RebuildConfig} = require('@reframe/core/build');

const browserConfig = new Config();

browserConfig.add([
    new StandardConfig({
        entry: require.resolve('./src'),
    }),
    new ReactConfig(),
    /*
    new RebuildConfig({
        pagesPath: require.resolve('../pages'),
    }),
    */
]);

const webpackBrowserConfig = browserConfig.assemble({log: true});

const serverConfig = new Config();

serverConfig.add([
    new StandardNodeConfig({
        entry: {
            pages: require.resolve('../pages'),
        },
    }),
    new ReactConfig(),
]);

const webpackServerConfig = serverConfig.assemble({log: true});


//module.exports = [webpackServerConfig, webpackBrowserConfig];
module.exports = [webpackBrowserConfig, webpackServerConfig];
