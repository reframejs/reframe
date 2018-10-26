process.on('unhandledRejection', err => {throw err});
const express = require('express');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const UniversalExpressAdapter = require('@universal-adapter/express');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const {apiRequestsHandler, version} = require('wildcard-api');
const knex = require('../../db/setup');
require('../api');
const passport = require('./auth');

module.exports = start();

async function start() {
    const app = express();

    const {universalAdapter, addParams, serveContent, onServerClose} = (
      UniversalExpressAdapter([
        apiRequestsHandler,
        config.ServerRendering,
        config.StaticAssets,
      ])
    );

    /*
    app.use(universalAdapter);
    /*/
    // The middleware `addParams` add parameters to the `req` object.
    // (E.g. to be able to provide a `req.session` or a `req.loggedUser`.)
    // We run this middleware first to make sure that the extra parameters are available to all routes
 // app.use(addParams);
 // app.use(serveContent);
    //*/

    app.use(require('serve-static')(__dirname + '/../../public'));
    app.use(require('cookie-parser')());
    app.use(require('body-parser').urlencoded({ extended: true }));
    app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/auth/github', passport.authenticate('github'));
    app.get('/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/auth/github/failed' }),
      function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
      }
    );

    // Define your routes after `addParams` and `serveContent`
    app.get('/', (req, res, next) => {
      console.log(req.user);
      const username = (req.user||{}).username || 'anon';
      res.send('hey '+username);
      next();
    });

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
