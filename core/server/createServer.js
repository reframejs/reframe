const Hapi = require('hapi');
const {HapiServerRendering} = require('./HapiServerRendering');
const {build} = require('@reframe/core/build');
const {get_context} = require('@reframe/core/build/utils/get_context');
const path_module = require('path');
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
    context = get_context(),
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
        context,
    });

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering, options: {getPages: () => pages}},
    ]);

    return server;
}
