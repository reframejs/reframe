module.exports = serverPlugin;

function serverPlugin() {
    const packageName = require('./package.json').name;
    return {
        name: packageName,
        serverEntryFile: require.resolve('./startServer'),
        ejectables: [
            {
                name: 'server',
                description: 'Eject server',
                configMove: {
                    configPath: 'serverEntryFile',
                    newConfigValue: 'PROJECT_ROOT/server.js',
                },
            },
            {
                name: 'ssr',
                description: 'Eject Server-Side Rendering',
                dependencyMove: {
                    oldPath: packageName+'/HapiPluginServerRendering',
                    newPath: 'PROJECT_ROOT/server/HapiPluginServerRendering.js',
                },
            },
        ],
    };
}
