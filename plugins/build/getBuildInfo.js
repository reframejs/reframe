const getAssetInfos = require('webpack-ssr/getAssetInfos');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = getBuildInfo;

function getBuildInfo() {
    const projectConfig = getProjectConfig();
    const outputDir = projectConfig.projectFiles.buildOutputDir;
    const assetInfos = getAssetInfos({outputDir});

    const {staticAssetsDir, buildEnv} = assetInfos;
    const pageConfigs = getPageConfigs({assetInfos});

    return {pageConfigs, staticAssetsDir, buildEnv};
}

function getPageConfigs({assetInfos}) {
    const pageConfigs = (
        assetInfos
        .pageAssets
        .map(({pageName, pageExport, styles, scripts}) => {
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

            return pageConfig;
        })
    );

    return pageConfigs;
}
function makeUnique(paths) {
    return [...new Set(paths)];
}
