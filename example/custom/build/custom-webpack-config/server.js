const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');
const {getWebpackBrowserConfig, getWebpackServerConfig} = require('./webpack-config');

startServer();

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            getWebpackBrowserConfig,
            getWebpackServerConfig,
            log: true,
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
}
