const Hapi = require('hapi');
const HapiPluginServerRendering = require('@reframe/server/HapiPluginServerRendering');
const HapiPluginStaticAssets = require('@reframe/server/HapiPluginStaticAssets');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = start();

async function start() {
    const projectConfig = getProjectConfig();
    const {hapiServerConfig, htmlRenderer, projectFiles: {staticAssetDir, getPageConfigs}} = projectConfig;

    const server = Hapi.Server(hapiServerConfig);

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
                htmlRenderer,
            },
        },
    ]);

    return server;
}
