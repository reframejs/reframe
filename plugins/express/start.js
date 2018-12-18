const express = require('express');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const ExpressAdater = require('@universal-adapter/express');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
  const app = express();

  app.use(
    // We use https://github.com/brillout/universal-adapter to integrate Reframe with Koa
    new ExpressAdater([
      // Run `$ reframe eject server-rendering` to eject the server rendering code
      config.ServerRendering,
      // Run `$ reframe eject server-assets` to eject the static asset serving code
      config.StaticAssets,
    ])
  );

  const server = await startServer(app);

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

  server.stop = async () => {
    await closeServer(server);
  };

  return server;
}
async function closeServer(server) {
  server.close();
  // Wait until server closes
  await new Promise((r, f) => {server.on('close', r); server.on('error', f);});
}
