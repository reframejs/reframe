const Hapi = require('hapi');
/*
const HapiPluginServerRendering = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets = require('./HapiPluginStaticAssets');
*/
const {HapiPluginServerRendering__create} = require('./HapiPluginServerRendering');
const {HapiPluginStaticAssets__create} = require('@rebuild/build/utils/HapiPluginStaticAssets');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = startServer;

async function startServer(buildState) {
    /*
    const projectConfig = getProjectConfig();

    const server = Hapi.Server(projectConfig.hapiServerConfig);
    */
    const server = Hapi.Server({
        port: 3000,
        debug: {
            request: ['internal'],
        },
    });

    const HapiPluginStaticAssets = HapiPluginStaticAssets__create(buildState.browserDistPath);
    const HapiPluginServerRendering = HapiPluginServerRendering__create(buildState);

    await server.register([
        HapiPluginStaticAssets,
        HapiPluginServerRendering,
    ]);

    server.start();

    return server;
}
