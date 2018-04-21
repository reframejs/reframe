module.exports = serverPlugin;

function serverPlugin() {
    const packageName = require('./package.json').name;

    const serverEntryFile = require.resolve('./startServer');
    const serverEntryFile_ejectedPath = 'PROJECT_ROOT/server/index.js';

    const serverEjectName = 'server';
    const ssrEjectName = 'server-ssr';
    const assetsEjectName = 'server-assets';

    return {
        name: packageName,
        serverEntryFile,
        ejectables: [
            {
                name: serverEjectName,
                description: 'Eject hapi server code',
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
                name: ssrEjectName,
                description: 'Eject Server-Side Rendering plugin code',
                fileCopies: [
                    {
                        oldPath: packageName+'/HapiPluginServerRendering',
                        newPath: 'PROJECT_ROOT/server/HapiPluginServerRendering.js',
                        noDependerMessage: 'Did you run `eject '+serverEjectName+'` before running `eject '+ssrEjectName+'`?',
                    },
                ],
            },
            {
                name: assetsEjectName,
                description: 'Eject static assets servering plugin code',
                fileCopies: [
                    {
                        oldPath: packageName+'/HapiPluginStaticAssets',
                        newPath: 'PROJECT_ROOT/server/HapiPluginStaticAssets.js',
                        noDependerMessage: 'Did you run `eject '+serverEjectName+'` before running `eject '+assetsEjectName+'`?',
                    },
                ],
            },
        ],
    };
}
