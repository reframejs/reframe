const {HapiPlugin_ServerRendering__create} = require('./HapiServerRendering');
const buildDefault = require('@reframe/build');
const {get_context} = require('@reframe/build/utils/get_context');
const {generate_HapiServeBrowserAssets} = require('@rebuild/build/utils/HapiServeBrowserAssets');
const path_module = require('path');
const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;

const {processReframeConfig} = require('@reframe/utils');
const Repage = require('@repage/core');

module.exports = {getReframeHapiPlugins};

async function getReframeHapiPlugins({
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
                !browserDistPath || browserDistPath===args.browserDistPath,
                "The directory holding the static assets isn't expected to move.",
                "Yet it is moving from `"+browserDistPath+"` to `"+args.browserDistPath+"`."
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

    const HapiServeBrowserAssets = generate_HapiServeBrowserAssets(build_state.browserDistPath);
    const HapiServerRendering = get_HapiPluginSSR(build_state, reframeConfig);

    return {
        HapiServerRendering,
        HapiServeBrowserAssets,
    };
}

function get_HapiPluginSSR(build_state, reframeConfig) {
    const repage_plugins = get_repage_plugins(reframeConfig);

    const cache = {};

    const HapiServerRendering = HapiPlugin_ServerRendering__create(() => get_repage_object(build_state.pages, cache, repage_plugins));
    return HapiServerRendering;
}

function get_repage_plugins(reframeConfig) {
    processReframeConfig(reframeConfig);
    const {repage_plugins} = reframeConfig._processed;
    assert_internal(repage_plugins.constructor===Array);
    return repage_plugins;
}

function create_repage_object(pages_) {
    assert_internal(pages_);

    const repage_object = new Repage();
    repage_object.addPlugins(repage_plugins);
    repage_object.addPages(pages_);

    return repage_object;
}

function get_repage_object(pages, cache, repage_plugins) {
    assert_internal(pages.constructor===Array, pages);
    if( pages !== cache.pages ) {
        cache.pages = pages;
        cache.repage_object = create_repage_object(pages, repage_plugins);
    }

    assert_internal(cache.repage_object.isRepageObject);
    return cache.repage_object;
}
