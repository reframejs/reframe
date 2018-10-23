const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const {apiRequestsHandler} = require('./api');
const knex = require('../db/setup');
const UniversalHapiAdapter = require('../../../examples/typeorm/server/universal-adapters/hapi');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    // Run `$ reframe eject server-integration` to eject the integration plugin.
 // await server.register(config.hapiIntegrationPlugin);
    await server.register(
      UniversalHapiAdapter({
        handlers: [
          apiRequestsHandler,
          {
            reqHandler: require(config.ServerRenderingFile)
          },
          {
            reqHandler: require(config.StaticAssetsFile)
          },
        ],
      })
    );

    server.ext('onPostStop', () => knex.destroy());

    await server.start();


    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
