const Hapi = require('hapi');
const {getHapiPlugins} = require('@reframe/server/getHapiPlugins');
const {getWebpackBrowserConfig, getWebpackServerConfig} = require('./config-mod');
const path = require('path');

startServer();

async function startServer() {
    const server = Hapi.Server({port: 3000});

    const pagesDir = path.resolve(__dirname, './pages');

    const {HapiPluginReframe} = (
        await getHapiPlugins({
            pagesDir,
            getWebpackBrowserConfig,
            getWebpackServerConfig,
        })
    );

    await server.register([
        {plugin: HapiPluginReframe},
    ]);

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
}
