const Hapi = require('hapi');
const {HapiServerRendering} = require('./HapiServerRendering');
const {build} = require('@reframe/core/build');
const assert = require('reassert');
const assert_internal = assert;

module.exports = {createServer};

async function createServer({
    server: server__created_by_user,
    log=false,
    port = 3000,
    debug = {
     // log: '*',
     // request: '*',
     // request: ['error'],
        request: ['internal'],
    },
    pagesDir,
    ...server_opts
}) {
    const server = (
        server__created_by_user ||
        Hapi.Server({
            port,
            debug,
            ...server_opts
        })
    );

    let pages;
    let HapiServeBrowserAssets;

    await build({
        pagesDir,
        log,
        onBuild: async args => {
            if( HapiServeBrowserAssets ) {
                // make sure that the directory we are serving is still the dist directory
                assert_internal(HapiServeBrowserAssets.name===args.HapiServeBrowserAssets.name);
            } else {
                HapiServeBrowserAssets = args.HapiServeBrowserAssets;
            }
            pages = args.pages;
        },
    });

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering, options: {getPages: () => pages}},
    ]);

    return server;
}
