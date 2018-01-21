const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');
const {getWebpackBrowserConfig, getWebpackServerConfig} = require('./config-mod');
const path = require('path');

startServer();

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const pagesDir = path.resolve(__dirname, './pages');

    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            pagesDir,
            getWebpackBrowserConfig,
            getWebpackServerConfig,
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
}
