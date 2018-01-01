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
            assert_internal(
                !HapiServeBrowserAssets || HapiServeBrowserAssets.name===args.HapiServeBrowserAssets.name,
                "We expect the served `dist/` directory to always be at the same path"
            );
            HapiServeBrowserAssets = HapiServeBrowserAssets || args.HapiServeBrowserAssets;
            pages = args.pages;
        },
        context,
    });
    assert_internal(HapiServeBrowserAssets);
    assert_internal(pages);

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering, options: {getPages: () => pages}},
    ]);

    return server;
}
