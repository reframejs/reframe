const {Config, StandardConfig, StandardNodeConfig, ReactConfig} = require('@rebuild/config');
const {RebuildConfig} = require('@reframe/core/build');

module.exports = (
    ({browserEntries, serverEntries}) =>
        [
            webpackBrowserConfig(browserEntries),
            webpackServerConfig(serverEntries)
        ]
);

function webpackBrowserConfig(browserEntries) {
    const browserConfig = new Config();

    browserConfig.add([
        new StandardConfig({
         // entry: require.resolve('./src'),
            entry: browserEntries,
        }),
        new ReactConfig(),
        /*
        new RebuildConfig({
            pagesPath: require.resolve('../pages'),
        }),
        */
    ]);

    return browserConfig.assemble({log: true});
}

function webpackServerConfig(serverEntries) {
    const serverConfig = new Config();

    serverConfig.add([
        new StandardNodeConfig({
            entry: serverEntries,
            /*
            entry: {
                pages: require.resolve('../pages'),
            },
            */
        }),
        new ReactConfig(),
    ]);

    return serverConfig.assemble({log: true});
}
