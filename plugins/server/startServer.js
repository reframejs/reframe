const Hapi = require('hapi');
const HapiPluginServerRendering = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets = require('./HapiPluginStaticAssets');
const chalk = require('chalk');

module.exports = startServer();

async function startServer() {
    // By default, Reframe uses the hapi framework to create a server.
    // More infos about hapi at https://hapijs.com/
    // You can as well use Reframe with another server framework such as Express.
    const server = Hapi.Server({
        port: 3000,
        debug: {
            request: ['internal'],
        },
    });

    await server.register([
        // This plugin serves all static assets such as JavaScript, (static) HTMLs, images, etc.
        // Run `reframe eject server-assets` to customize this plugin.
        HapiPluginStaticAssets,
        // This plugin serves the dynamic HTMLs.
        // Run `reframe eject server-ssr` to customize this plugin.
        HapiPluginServerRendering,
    ]);

    await server.start();

    console.log(chalk.green('\u2714')+' Server running '+server.info.uri);

    return server;
}
