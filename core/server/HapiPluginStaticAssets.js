const {HapiPluginStaticAssets__create} = require('@rebuild/build/utils/HapiPluginStaticAssets');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = () => {
    const projectConfig = getProjectConfig();
    const {staticAssetsDir} = projectConfig.projectFiles;
    const HapiPluginStaticAssets = HapiPluginStaticAssets__create(staticAssetsDir);
    return HapiPluginStaticAssets;
};
