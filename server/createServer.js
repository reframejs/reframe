const Hapi = require('hapi');
const {HapiServerRendering} = require('./HapiServerRendering');
const {build} = require('@reframe/build');
const {get_context} = require('@reframe/build/utils/get_context');
const path_module = require('path');
const assert = require('reassert');
const assert_internal = assert;

module.exports = {createServer};

async function createServer({
    // build opts
    pagesDir,
    log=false,
    webpackBrowserConfig,
    webpackServerConfig,
    getWebpackBrowserConfig,
    getWebpackServerConfig,
    doNotAutoReload,
    context = get_context(),

    // server opts
    server: server__created_by_user,
    port = 3000,
    debug = {
        request: ['internal'],
    },
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
        webpackBrowserConfig,
        webpackServerConfig,
        getWebpackBrowserConfig,
        getWebpackServerConfig,
        doNotAutoReload,
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
