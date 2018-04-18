const Hapi = require('hapi');
const HapiPluginServerRendering = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets = require('./HapiPluginStaticAssets');
const chalk = require('chalk');

module.exports = startServer();

async function startServer() {
    const server = Hapi.Server({
        port: 3000,
        debug: {
            request: ['internal'],
        },
    });

    await server.register([
        HapiPluginStaticAssets,
        HapiPluginServerRendering,
    ]);

    server.start();

    console.log(chalk.green('\u2714')+' Server running at '+server.info.uri);

    return server;
}
