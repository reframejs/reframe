module.exports = buildPlugin;

function buildPlugin() {
    const packageName = require('./package.json').name;

    const serverEntryFile = require.resolve('./startServer');
    const serverEntryFile_ejectedPath = 'PROJECT_ROOT/server/index.js';

    const buildEjectName = 'build';
    const staticRenderingEjectName = 'build-static-rendering';
    const browserEntriesEjectName = 'build-browser-entries';

    return {
        name: packageName,
        build: {
            executeBuild: require.resolve('./executeBuild'),
            getPageConfigs: require.resolve('./getPageConfigs'),
            getStaticAssetsDir: require.resolve('./getStaticAssetsDir'),
        },
        ejectables: [
            {
                name: BuildEjectName,
                description: 'Eject build code',
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
                name: staticRenderingEjectName,
                description: 'Eject Static Rendering code',
                fileCopies: [
                    {
                        oldPath: packageName+'/getPageHTMLs',
                        newPath: 'PROJECT_ROOT/build/getPageHTMLs.js',
                        noDependerMessage: 'Run `eject '+buildEjectName+'` before running `eject '+staticRenderingEjectName+'`.',
                    },
                ],
            },
            {
                name: browserEntriesEjectName,
                description: 'Eject code that generates browser entries',
                fileCopies: [
                    {
                        oldPath: packageName+'/getPageBrowserEntries',
                        newPath: 'PROJECT_ROOT/build/getPageBrowserEntries.js',
                        noDependerMessage: 'Run `eject '+buildEjectName+'` before running `eject '+browserEntriesEjectName+'`.',
                    },
                ],
            },
        ],
    };
}
