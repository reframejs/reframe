const Hapi = require('hapi');
const {getHapiPlugins} = require('@reframe/server/getHapiPlugins');
const {getWebpackBrowserConfig, getWebpackServerConfig} = require('./webpack-config');

startServer();

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const {HapiPluginReframe} = (
        await getHapiPlugins({
            getWebpackBrowserConfig,
            getWebpackServerConfig,
            log: true,
        })
    );

    await server.register([
        {plugin: HapiPluginReframe},
    ]);

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
}
