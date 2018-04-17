module.exports = buildPlugin;

function buildPlugin() {
    const packageName = require('./package.json').name;
    return {
        name: packageName,
        build: {
            executeBuild: packageName+'/executeBuild',
            getPageConfigs: packageName+'/getPageConfigs',
            getStaticAssetsDir: packageName+'/getStaticAssetsDir',
        },
    };
}
