process.on('unhandledRejection', err => {throw err});
const {HapiServerRedering} = require('@reframe/core/server');
const Hapi = require('hapi');
const pages = require('./pages');
const {serveBrowserAssets} = require('./browser/serve');

const server = Hapi.Server({port: 3000});

const isProduction = process.env['NODE_ENV'] === 'production';
const serveOptions = {
    autoreload: !isProduction,
    createServer: false,
};

(async () => {
    const {HapiServeBrowserAssets} = await serveBrowserAssets(serveOptions);

    await server.register([
        {plugin: HapiServerRedering, options: {pages}},
        {plugin: HapiServeBrowserAssets},
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();
