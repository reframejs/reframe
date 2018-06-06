const Hapi = require('hapi');
const ConfigHandlers = require('./ConfigHandlers');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: 3000,
        debug: {request: ['internal']},
    });

    // `ConfigHandlers` applies the request handlers defined in the config.
    // (E.g. the `@reframe/server` plugin adds request handlers to the config
    // that serve your pages' HTMLs and that serve your static assets.)
    // Run the eject command `$ reframe eject hapi` to eject the entire hapi code.
    // You will then be able to use any other web framework such as Express.
    await server.register(ConfigHandlers);

    await server.start();

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
