process.on('unhandledRejection', err => {throw err});
const express = require('express');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const UniversalExpressAdapter = require('@universal-adapter/express');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const {apiRequestsHandler, version} = require('wildcard-api');
require('./api');
const knex = require('../db/setup');

module.exports = start();

async function start() {
    const app = express();

    app.use(
      UniversalExpressAdapter([
        apiRequestsHandler,
        config.ServerRendering,
        config.StaticAssets,
      ])
    );

    /*
    app.get('/', function (req, res) {
      res.send('Hello Worl2d')
    });

    app.get('/', function (req, res) {
      res.send('Hello World')
    });
    */

    app.listen(3000);

    /*
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    server.ext('onPostStop', () => knex.destroy());

    await server.start();


    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
    */
}

