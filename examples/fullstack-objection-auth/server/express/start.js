process.on('unhandledRejection', err => {throw err});
const express = require('express');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const ExpressAdater = require('@universal-adapter/express');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const {wildcardPlug} = require('wildcard-api');
const knex = require('../../db/setup');
require('../endpoints/view-endpoints');
require('../endpoints/action-endpoints');
const auth = require('./auth');

module.exports = start();

async function start() {
    const app = express();

    auth(app);

    const {universalAdapter, onServerClose} = (
      ExpressAdater([
        wildcardPlug,
        config.ServerRendering,
        config.StaticAssets,
      ], {
        addRequestContext: req => ({user: req.user}),
      })
    );

    app.use(universalAdapter);

    const server = await startServer(app);

    server.stop = async () => {
      await knex.destroy();
      await onServerClose();
      await closeServer(server);
    };

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}

async function startServer(app) {
  const http = require('http');
  const server = http.createServer(app);
  server.listen(process.env.PORT || 3000);
  // Wait until the server has started
  await new Promise((r, f) => {server.on('listening', r); server.on('error', f);});
  return server;
}
async function closeServer(server) {
  server.close();
  // Wait until server closes
  await new Promise((r, f) => {server.on('close', r); server.on('error', f);});
}
