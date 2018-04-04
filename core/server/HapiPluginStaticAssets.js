const {HapiPluginStaticAssets__create} = require('@rebuild/build/utils/HapiPluginStaticAssets');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

const HapiPluginStaticAssets = {
    name: 'ReframeStaticAssets',
    multiple: false,
    register,
};

module.exports = HapiPluginStaticAssets;

async function register(server) {
    const projectConfig = getProjectConfig();
    const {staticAssetsDir} = projectConfig.projectFiles;
    await server.register([
        {plugin: HapiPluginStaticAssets__create(staticAssetsDir)},
    ]);
}
