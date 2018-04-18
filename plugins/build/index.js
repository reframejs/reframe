module.exports = buildPlugin;

function buildPlugin() {
    return {
        name: require('./package.json').name,
        build: {
            executeBuild: require.resolve('./executeBuild'),
            getPageConfigs: require.resolve('./getPageConfigs'),
            getStaticAssetsDir: require.resolve('./getStaticAssetsDir'),
        },
    };
}
