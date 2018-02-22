const Hapi = require('hapi');
const {getHapiPlugins} = require('./getHapiPlugins');
const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;

module.exports = {createHapiServer};

async function createHapiServer({
    // build opts
    pagesDir,
    reframeConfig,
    appDirPath,

    // server opts
    port = 3000,
    debug = {
        request: ['internal'],
    },
    ...server_opts
}) {
    reframeConfig = reframeConfig || {};

    assert_usage(pagesDir);
    assert_usage(reframeConfig);
    assert_usage(appDirPath);

    const server = (
        Hapi.Server({
            port,
            debug,
            ...server_opts
        })
    );

    const {HapiPluginReframe, build_state} = (
        await getHapiPlugins({
            reframeConfig,
            pagesDir,
         // log: opts.log,
            context: appDirPath,
        })
    );

    await server.register([
        {plugin: HapiPluginReframe},
    ]);

    return {server, build_state};
}
