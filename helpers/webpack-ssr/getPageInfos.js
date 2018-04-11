const assert_internal = require('reassert/internal');
const forceRequire = require('./utils/forceRequire');
const fs = require('fs');
const pathModule = require('path');

module.exports = getPageInfos;

function getPageInfos({outputDir}) {
    const assetMap = readAssetMap({outputDir});

    return (
        Object.entries(assetMap.pageAssets)
        .map(([pageName, {pageFileTranspiled, styles, scripts}]) => {
            assert_internal(pageFileTranspiled);
            assert_internal(styles.length>=0);
            assert_internal(scripts.length>=0);

            const pageExport = forceRequire(pageFileTranspiled);

            return {
                pageName,
                pageExport,
                pageAssets: {
                    styles,
                    scripts,
                },
            }
        })
    );
}

function readAssetMap({outputDir}) {
    const assetMapPath = pathModule.resolve(outputDir, 'assetMap.json');
    return JSON.parse(readFile(assetMapPath));
}

function readFile(filepath) {
    return fs.readFileSync(filepath, 'utf8');
}
