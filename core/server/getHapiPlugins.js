const {HapiPluginServerRendering__create} = require('./HapiPluginServerRendering');
const buildDefault = require('@reframe/build');
const get_parent_dirname = require('@brillout/get-parent-dirname');
const {HapiPluginStaticAssets__create} = require('@rebuild/build/utils/HapiPluginStaticAssets');
const {HapiPluginReframe__create} = require('./HapiPluginReframe');
const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;

module.exports = getHapiPlugins;

async function getHapiPlugins({
    appDirPath = get_parent_dirname(),
    build = buildDefault,
    reframeConfig={},
    ...build_opts
}) {
    const build_state = {};
    await build({
        onBuild: async build_state__new => {
            assert_internal(build_state__new.browserDistPath, build_state__new);
            assert_internal(build_state__new.pages, build_state__new);
            assert_usage(
                !build_state.browserDistPath || build_state.browserDistPath===build_state__new.browserDistPath,
                "The directory holding the static assets isn't expected to move.",
                "Yet it is moving from `"+build_state.browserDistPath+"` to `"+build_state__new.browserDistPath+"`."
            );
            Object.assign(build_state, build_state__new);
        },
        appDirPath,
        reframeConfig,
        ...build_opts,
    });
    assert_internal(build_state.browserDistPath);
    assert_internal(build_state.pages);

    const HapiPluginStaticAssets = HapiPluginStaticAssets__create(build_state.browserDistPath);
    const HapiPluginServerRendering = HapiPluginServerRendering__create(build_state, reframeConfig);
    const HapiPluginReframe = HapiPluginReframe__create({HapiPluginStaticAssets, HapiPluginServerRendering});

    return {
        HapiPluginReframe,
        HapiPluginServerRendering,
        HapiPluginStaticAssets,
        build_state,
    };
}
