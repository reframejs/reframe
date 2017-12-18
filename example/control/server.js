process.on('unhandledRejection', err => {throw err});
require('source-map-support').install();

const {HapiServerRendering} = require('@reframe/core/server');
const Hapi = require('hapi');
const {serveBrowserAssets} = require('./browser/serve');
const chalk = require('chalk');

const isProduction = process.env['NODE_ENV'] === 'production';

let server;
serveBrowserAssets({
    doNotAutoReload: isProduction,
    onBuild: async ({HapiServeBrowserAssets, pages, isFirstBuild}) => {
        if( server ) {
            await server.stop();
        }

        server = Hapi.Server({
            port: 3000,
         // debug: {log: '*', request: '*'}
         // debug: {request: ['error']}
            debug: {request: ['internal']}
        });

        await server.register([
            {plugin: HapiServeBrowserAssets},
            {plugin: HapiServerRendering, options: {pages}},
        ]);

        await server.start();

        if( isFirstBuild ) {
            console.log(green_checkmark()+` Server running at ${server.info.uri}`);
        }
    },
});

function green_checkmark() {
    return chalk.green('\u2714');
}
