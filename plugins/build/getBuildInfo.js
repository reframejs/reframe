const getAssetInfos = require('webpack-ssr/getAssetInfos');
const reconfig = require('@brillout/reconfig');

module.exports = getBuildInfo;

function getBuildInfo({shouldBeProductionBuild}={}) {
    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});

    const outputDir = reframeConfig.projectFiles.buildOutputDir;

    const assetInfos = getAssetInfos({outputDir, shouldBeProductionBuild});

    const {pageAssets, ...assetInfos__rest} = assetInfos;
    const pageConfigs = getPageConfigs({pageAssets});

    return {...assetInfos__rest, pageConfigs};
}

function getPageConfigs({pageAssets}) {
    const pageConfigs = (
        pageAssets
        .map(({pageName, pageFile, pageFileTranspiled, pageExport, styles, scripts}) => {
            const pageConfig = pageExport;

            pageConfig.scripts = makeUnique([
                ...(scripts||[]),
                ...(pageConfig.scripts||[]),
            ]);

            pageConfig.styles = makeUnique([
                ...(styles||[]),
                ...(pageConfig.styles||[])
            ]);

            pageConfig.pageName = pageName;
            pageConfig.pageFile = pageFile;
            pageConfig.pageFileTranspiled = pageFileTranspiled;

            return pageConfig;
        })
    );

    return pageConfigs;
}
function makeUnique(paths) {
    return [...new Set(paths)];
}
