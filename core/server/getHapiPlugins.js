const {HapiPluginServerRendering__create} = require('./HapiPluginServerRendering');
const buildDefault = require('@reframe/build');
const {get_context} = require('@reframe/build/utils/get_context');
const {HapiPluginStaticAssets__create} = require('@rebuild/build/utils/HapiPluginStaticAssets');
const {HapiPluginReframe__create} = require('./HapiPluginReframe');
const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;

module.exports = {getHapiPlugins};

async function getHapiPlugins({
    context = get_context(),
    build = buildDefault,
    reframeConfig={},
    ...build_opts
}) {
    const build_state = {};
    await build({
        onBuild: async args => {
            assert_internal(args.browserDistPath);
            assert_internal(args.pages);
            assert_usage(
                !build_state.browserDistPath || build_state.browserDistPath===args.browserDistPath,
                "The directory holding the static assets isn't expected to move.",
                "Yet it is moving from `"+build_state.browserDistPath+"` to `"+args.browserDistPath+"`."
            );
            build_state.browserDistPath = args.browserDistPath;
            build_state.pages = args.pages;
        },
        context,
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
    };
}
