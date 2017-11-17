process.on('unhandledRejection', err => {throw err});
const {HapiServerRedering} = require('@reframe/core/server');
const Hapi = require('hapi');
const pages = require('./pages');
const {serveBrowserAssets} = require('./browser/serve');

const server = Hapi.Server({port: 3000});

const isProduction = process.env['NODE_ENV'] === 'production';
const serveOptions = {
    doNotAutoReload: isProduction,
    doNotCreateServer: true,
};

(async () => {
    const {HapiServeBrowserAssets, output} = await serveBrowserAssets(serveOptions);

    await server.register([
        {plugin: HapiServerRedering, options: {buildOutput: output, pages}},
        {plugin: HapiServeBrowserAssets},
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();
