const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const {apiRequestsHandler, version} = require('wildcard-api');
require('./api');
const knex = require('../db/setup');
const UniversalHapiAdapter = require('@universal-adapter/hapi');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    await server.register(
      UniversalHapiAdapter([
        apiRequestsHandler,
        config.ServerRendering,
        config.StaticAssets,
      ])
    );

    server.ext('onPostStop', () => knex.destroy());

    await server.start();


    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
