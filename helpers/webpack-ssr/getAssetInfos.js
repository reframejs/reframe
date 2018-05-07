const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const forceRequire = require('@rebuild/build/utils/forceRequire');
const fs = require('fs');
const pathModule = require('path');

let cache;

module.exports = getAssetInfos;

function getAssetInfos({outputDir}) {
    const assetInfos = readAssetMap({outputDir});

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

function readAssetMap({outputDir}) {
    const assetMapPath = pathModule.resolve(outputDir, 'assetInfos.json');
    const assetMapContent = readFile(assetMapPath);
    assert_usage(
        assetMapContent!==null,
        "The asset information file `"+assetMapPath+"` is missing.",
        "The build needs to have been run previously.",
        "(The build generates `"+assetMapPath+"`.)"
    );
    return JSON.parse(assetMapContent);
}

function readFile(filepath) {
    try {
        return fs.readFileSync(filepath, 'utf8');
    } catch(e) {
        return null;
    }
}
