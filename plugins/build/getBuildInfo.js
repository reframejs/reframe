const getAssetInfos = require('webpack-ssr/getAssetInfos');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const assert = require('reassert');

module.exports = getBuildInfo;

function getBuildInfo({shouldBeProductionBuild}={}) {
    const outputDir = config.projectFiles.buildOutputDir;
    assert.internal(outputDir);

    const assetInfos = getAssetInfos({outputDir, shouldBeProductionBuild});

    const {pageAssets, ...assetInfos__rest} = assetInfos;
    const pageConfigs = getPageConfigs({pageAssets});

    return {...assetInfos__rest, pageConfigs};
}

function getPageConfigs({pageAssets}) {
    const pageConfigs = (
        pageAssets
        .map(({pageName, pageFile, pageFileTranspiled, pageExport, styles, scripts}) => {
            const pageConfig = {};

            Object.assign(
                pageConfig,
                config.defaultPageConfig,
                pageExport,
            );

            Object.assign(
                pageConfig,
                {
                    scripts: (
                        makeUnique([
                            ...(scripts||[]),
                            ...(pageConfig.scripts||[]),
                        ])
                    ),
                    styles: (
                        makeUnique([
                            ...(styles||[]),
                            ...(pageConfig.styles||[])
                        ])
                    ),
                    pageName,
                    pageFile,
                    pageFileTranspiled,
                }
            );

            return pageConfig;
        })
    );

    return pageConfigs;
}
function makeUnique(paths) {
    return [...new Set(paths)];
}
