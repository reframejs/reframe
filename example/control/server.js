process.on('unhandledRejection', err => {throw err});
const {HapiServerRendering} = require('@reframe/core/server');
const Hapi = require('hapi');
const {serveBrowserAssets} = require('./browser/serve');

const server = Hapi.Server({port: 3000});

const isProduction = process.env['NODE_ENV'] === 'production';
const serveOptions = {
    doNotAutoReload: isProduction,
    doNotCreateServer: true,
};

(async () => {
    const {HapiServeBrowserAssets, pages} = await serveBrowserAssets(serveOptions);

    await server.register([
        {plugin: HapiServerRendering, options: {pages}},
        {plugin: HapiServeBrowserAssets},
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();
