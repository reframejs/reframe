const getAssetInfos = require('webpack-ssr/getAssetInfos');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = getStaticAssetsDir;

function getStaticAssetsDir() {
    const projectConfig = getProjectConfig();
    const outputDir = projectConfig.projectFiles.buildOutputDir;
    const assetInfos = getAssetInfos({outputDir});
    return assetInfos.staticAssetsDir;
}
