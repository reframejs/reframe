const assert_internal = require('reassert/internal');
const forceRequire = require('./utils/forceRequire');
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
    return JSON.parse(readFile(assetMapPath));
}

function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf8');
}
