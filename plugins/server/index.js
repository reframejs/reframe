module.exports = serverPlugin;

function serverPlugin() {
    const packageName = require('./package.json').name;

    const serverEntryFile = require.resolve('./startServer');
    const serverEntryFile_ejectedPath = 'PROJECT_ROOT/server/index.js';

    const serverEjectName = 'server';
    const ssrEjectName = 'server-rendering';
    const assetsEjectName = 'server-assets';

    return {
        name: packageName,
        serverEntryFile,
        ejectables: [
            {
                name: serverEjectName,
                description: 'Eject the hapi server code.',
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
                description: 'Eject the hapi plugin `HapiPluginServerRendering` responsible for server-side rendering.',
                fileCopies: [
                    {
                        oldPath: packageName+'/HapiPluginServerRendering',
                        newPath: 'PROJECT_ROOT/server/HapiPluginServerRendering.js',
                        noDependerMessage: (
                            'Did you run `eject '+serverEjectName+'` before running `eject '+ssrEjectName+'`?\n'+
                            'Did you run `eject '+ssrEjectName+'` already?'
                        ),
                    },
                ],
            },
            {
                name: assetsEjectName,
                description: 'Eject the hapi plugin `HapiPluginStaticAssets` responsible for serving static assets.',
                fileCopies: [
                    {
                        oldPath: packageName+'/HapiPluginStaticAssets',
                        newPath: 'PROJECT_ROOT/server/HapiPluginStaticAssets.js',
                        noDependerMessage: (
                            'Did you run `eject '+serverEjectName+'` before running `eject '+assetsEjectName+'`?\n'+
                            'Did you run `eject '+assetsEjectName+'` already?'
                        ),
                    },
                ],
            },
        ],
    };
}
