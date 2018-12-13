const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const HapiAdapter = require('@universal-adapter/hapi');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    await server.register(
      // We use `@universal-adapter` to integrate Reframe with Hapi
      HapiAdapter([
        // Run `$ reframe eject server-rendering` to eject the server rendering code
        config.ServerRendering,
        // Run `$ reframe eject server-assets` to eject the static asset serving code
        config.StaticAssets,
      ])
    );

    server.route({
        method: 'GET',
        path:'/hello-from-hapi',
        handler: function (request, h) {
            return 'Route defined with Hapi. Could be an API endpoint.';
        }
    });

    await server.start();

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
