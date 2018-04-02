const Hapi = require('hapi');
/*
const HapiPluginServerRendering = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets = require('./HapiPluginStaticAssets');
*/
const {HapiPluginServerRendering__create} = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets__create = require('./HapiPluginStaticAssets');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const chalk = require('chalk');

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

    const HapiPluginStaticAssets = HapiPluginStaticAssets__create();
    const HapiPluginServerRendering = HapiPluginServerRendering__create(buildState);

    await server.register([
        HapiPluginStaticAssets,
        HapiPluginServerRendering,
    ]);

    server.start();

    console.log(chalk.green('\u2714')+' Server running at '+server.info.uri);

    return server;
}
