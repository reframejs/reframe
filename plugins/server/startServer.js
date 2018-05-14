const Hapi = require('hapi');
const HapiPluginServerRendering = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets = require('./HapiPluginStaticAssets');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = startServer();

async function startServer() {
    // By default, Reframe uses the hapi framework (https://hapijs.com/) to create a server.
    // You can as well use Reframe with another server framework such as Express.
    const server = Hapi.Server({
        port: 3000,
        debug: {request: ['internal']},
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

    console.log([
        symbolSuccess,
        'Server running ',
        '(for '+colorEmphasis(process.env.NODE_ENV||'development')+')',
    ].join(''));

    return server;
}
