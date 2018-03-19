const Hapi = require('hapi');
const HapiPluginServerRendering = require('@reframe/server/HapiPluginServerRendering');
const HapiPluginStaticAssets = require('@reframe/server/HapiPluginStaticAssets');
const getReframeConfig = require('@reframe/utils/getReframeConfig');

module.exports = start();

async function start() {
    const reframeConfig = getReframeConfig();
    const {serverConfig, fileStructure: {staticAssetDir, buildFile}} = reframeConfig._processed;

    const {getPageConfigs} = await require(buildFile)();

    const server = Hapi.Server(serverConfig);

    await server.register([
        {
            plugin: HapiPluginStaticAssets,
            options: {
                staticAssetDir,
            },
        },
        {
            plugin: HapiPluginServerRendering,
            options: {
                getPageConfigs,
            },
        },
    ]);

    return server;
}
