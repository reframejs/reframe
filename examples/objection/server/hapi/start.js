const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const {wildcardPlug} = require('wildcard-api');
const knex = require('../../db/setup');
require('../endpoints/view-endpoints');
require('../endpoints/action-endpoints');
const HapiAdapter = require('@universal-adapter/hapi');
const auth = require('./auth');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    await auth(server);

    await server.register(
      HapiAdapter([
        wildcardPlug,
        config.ServerRendering,
        config.StaticAssets,
      ], {
        addRequestContext: request => ({user: request.user}),
      })
    );

    server.ext('onPostStop', () => knex.destroy());

    await server.start();

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
