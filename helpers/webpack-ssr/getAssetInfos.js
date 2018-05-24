const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const forceRequire = require('@rebuild/build/utils/forceRequire');
const fs = require('fs');
const pathModule = require('path');
const {colorError} = require('@brillout/cli-theme');

let cache;

module.exports = getAssetInfos;

function getAssetInfos({outputDir, requireProductionBuild}) {
    const assetInfos = readAssetMap({outputDir, requireProductionBuild});

    if( cache && cache.buildTime === assetInfos.buildTime ) {
        return cache;
    }

    assetInfos.pageAssets = (
        Object.entries(assetInfos.pageAssets)
        .map(([pageName, assets]) => {
            const {pageFileTranspiled, styles, scripts} = assets;
            assert_internal(pageFileTranspiled);
            assert_internal(styles.length>=0);
            assert_internal(scripts.length>=0);

            const pageExport = forceRequire(pageFileTranspiled);

            return {...assets, pageName, pageExport};
        })
    );

    cache = assetInfos;

    return assetInfos;
}

function readAssetMap({outputDir, requireProductionBuild}) {
    const assetMapPath = pathModule.resolve(outputDir, 'assetInfos.json');
    const assetMapContent = readFile(assetMapPath);
    assert_usage(
        assetMapContent!==null,
        colorError("You need to build your app")+". (E.g. by running `$ reframe build`.)",
        "(No asset information file `"+assetMapPath+"` found which should be generated when building.)"
    );
    const assetInfos = JSON.parse(assetMapContent)
    assert_usage(
        !requireProductionBuild || assetInfos.buildEnv==='production',
        'Your app has been built for "'+assetInfos.buildEnv+'" but you need to '+colorError("build your app for production")+".",
        "(E.g. by running `$ reframe build`.)",
        "(The asset information file `"+assetMapPath+"` has `buildEnv` set to `"+assetInfos.buildEnv+"` but it should be `production`.)"
    );
    return assetInfos;
}

function readFile(filepath) {
    try {
        return fs.readFileSync(filepath, 'utf8');
    } catch(e) {
        return null;
    }
}
