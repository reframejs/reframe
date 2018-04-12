const assert_internal = require('reassert/internal');
const forceRequire = require('./utils/forceRequire');
const fs = require('fs');
const pathModule = require('path');

module.exports = getAssetInfos;

function getAssetInfos({outputDir}) {
    const assetInfos = readAssetMap({outputDir});

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

    return assetInfos;
}

function readAssetMap({outputDir}) {
    const assetMapPath = pathModule.resolve(outputDir, 'assetInfos.json');
    return JSON.parse(readFile(assetMapPath));
}

function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf8');
}
