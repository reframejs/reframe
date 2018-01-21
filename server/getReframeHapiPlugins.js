const {HapiServerRendering__create} = require('./HapiServerRendering');
const buildDefault = require('@reframe/build');
const {get_context} = require('@reframe/build/utils/get_context');
const {generate_HapiServeBrowserAssets} = require('@rebuild/build/utils/HapiServeBrowserAssets');
const path_module = require('path');
const assert = require('reassert');
const assert_internal = assert;
const assert_usage = assert;

module.exports = {getReframeHapiPlugins};

async function getReframeHapiPlugins({
    context = get_context(),
    build = buildDefault,
    ...build_opts
}) {
    /*
    assert_usage(
        build !== buildDefault || build_opts.pagesDir,
        "Provide either argument `build` or `pagesDir`."
    );
    */
    let pages;
    let HapiServeBrowserAssets;
    let browserDistPath;
    await build({
        onBuild: async args => {
            assert_internal(args.browserDistPath);
            assert_internal(args.pages);
            assert_usage(
                !browserDistPath || browserDistPath===args.browserDistPath,
                "We expect the served `dist/` directory to always be at the same path"
            );
            if( ! browserDistPath ) {
                browserDistPath = args.browserDistPath;
                HapiServeBrowserAssets = generate_HapiServeBrowserAssets(args.browserDistPath);
            }
            pages = args.pages;
        },
        context,
        ...build_opts,
    });
    assert_internal(HapiServeBrowserAssets);
    assert_internal(pages);

    const HapiServerRendering = HapiServerRendering__create({getPages: () => pages});

    return {
        HapiServerRendering,
        HapiServeBrowserAssets,
    };
}
