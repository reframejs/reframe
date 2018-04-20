module.exports = serverPlugin;

function serverPlugin() {
    const packageName = require('./package.json').name;

    const serverEntryFile = require.resolve('./startServer');
    const serverEntryFile_ejectedPath = 'PROJECT_ROOT/server/index.js';

    return {
        name: packageName,
        serverEntryFile,
        ejectables: [
            {
                name: 'server',
                description: 'Eject server',
                configChanges: [
                    {
                        configPath: 'serverEntryFile',
                        newConfigValue: serverEntryFile_ejectedPath,
                    },
                ],
                fileCopies: [
                    {
                        noDependerRequired: true,
                        oldPath: serverEntryFile,
                        newPath: serverEntryFile_ejectedPath,
                    },
                ],
            },
            {
                name: 'ssr',
                description: 'Eject Server-Side Rendering',
                fileCopies: [
                    {
                        oldPath: packageName+'/HapiPluginServerRendering',
                        newPath: 'PROJECT_ROOT/server/HapiPluginServerRendering.js',
                        noDependerMessage: 'Run `eject server` before running `eject ssr`.',
                    },
                ],
            },
        ],
    };
}
