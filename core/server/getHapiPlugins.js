const {HapiPluginServerRendering__create} = require('./HapiPluginServerRendering');
const get_parent_dirname = require('@brillout/get-parent-dirname');
const {HapiPluginStaticAssets__create} = require('@rebuild/build/utils/HapiPluginStaticAssets');
const {HapiPluginReframe__create} = require('./HapiPluginReframe');
const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;

// TODO
assert(false);

/*
module.exports = getHapiPlugins;

function getHapiPlugins({
    reframeConfig={},
    buildState,
    ...build_opts
}) {
    const HapiPluginStaticAssets = HapiPluginStaticAssets__create(buildState.browserDistPath);
    const HapiPluginServerRendering = HapiPluginServerRendering__create(buildState, reframeConfig);
    const HapiPluginReframe = HapiPluginReframe__create({HapiPluginStaticAssets, HapiPluginServerRendering});

    return {
        HapiPluginReframe,
        HapiPluginServerRendering,
        HapiPluginStaticAssets,
        build_state: buildState,
    };
}
*/
