process.on('unhandledRejection', err => {throw err});
const {HapiServerRendering} = require('@reframe/core/server');
const Hapi = require('hapi');
const {serveBrowserAssets} = require('./browser/serve');

const isProduction = process.env['NODE_ENV'] === 'production';

let server;
serveBrowserAssets({
    doNotAutoReload: isProduction,
    doNotCreateServer: true,
    onBuild: async ({HapiServeBrowserAssets, pages}) => {
        if( server ) {
            await server.stop();
        }

        server = Hapi.Server({port: 3000});

        await server.register([
            {plugin: HapiServerRendering, options: {pages}},
            {plugin: HapiServeBrowserAssets},
        ]);

        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    },
});
