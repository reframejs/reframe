const Hapi = require('hapi');
const HapiPluginServerRendering = require('@reframe/server/HapiPluginServerRendering');
const HapiPluginStaticAssets = require('@reframe/server/HapiPluginStaticAssets');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = start();

async function start() {
    const projectConfig = getProjectConfig();

    const server = Hapi.Server(projectConfig.hapiServerConfig);

    await server.register([
        HapiPluginStaticAssets,
        HapiPluginServerRendering,
    ]);

    return server;
}
