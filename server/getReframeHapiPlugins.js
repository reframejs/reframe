const {HapiServerRendering__create} = require('./HapiServerRendering');
const {build} = require('@reframe/build');
const {get_context} = require('@reframe/build/utils/get_context');
const path_module = require('path');
const assert = require('reassert');
const assert_internal = assert;

module.exports = {getReframeHapiPlugins};

async function getReframeHapiPlugins({
    context = get_context(),
    ...build_opts
}) {
    let pages;
    let HapiServeBrowserAssets;
    await build({
        onBuild: async args => {
            assert_internal(
                !HapiServeBrowserAssets || HapiServeBrowserAssets.name===args.HapiServeBrowserAssets.name,
                "We expect the served `dist/` directory to always be at the same path"
            );
            HapiServeBrowserAssets = HapiServeBrowserAssets || args.HapiServeBrowserAssets;
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
