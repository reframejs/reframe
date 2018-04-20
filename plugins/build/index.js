module.exports = buildPlugin;

function buildPlugin() {
    const packageName = require('./package.json').name;

    const executeBuild = require.resolve('./executeBuild');
    const executeBuild_ejectedPath = 'PROJECT_ROOT/build/index.js';

    const getBuildInfo = require.resolve('./getBuildInfo');
    const getBuildInfo_ejectedPath = 'PROJECT_ROOT/build/getBuildInfo.js';

    const buildEjectName = 'build';
    const staticRenderingEjectName = 'build-static-rendering';
    const browserEntriesEjectName = 'build-browser-entries';

    return {
        name: packageName,
        build: {
            executeBuild,
            getBuildInfo,
        },
        ejectables: [
            {
                name: buildEjectName,
                description: 'Eject build code',
                configChanges: [
                    {
                        configPath: 'build.executeBuild',
                        newConfigValue: executeBuild_ejectedPath,
                    },
                    {
                        configPath: 'build.getBuildInfo',
                        newConfigValue: getBuildInfo_ejectedPath,
                    },
                ],
                fileCopies: [
                    {
                        noDependerRequired: true,
                        oldPath: executeBuild,
                        newPath: executeBuild_ejectedPath,
                    },
                    {
                        noDependerRequired: true,
                        oldPath: getBuildInfo,
                        newPath: getBuildInfo_ejectedPath,
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
