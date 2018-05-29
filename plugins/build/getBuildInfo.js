const getAssetInfos = require('webpack-ssr/getAssetInfos');
const globalConfig = require('@brillout/global-config');

module.exports = getBuildInfo;

function getBuildInfo({requireProductionBuild}={}) {
    const outputDir = globalConfig.projectFiles.buildOutputDir;
    const assetInfos = getAssetInfos({outputDir, requireProductionBuild});

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
