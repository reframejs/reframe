const globalConfig = require('@brillout/global-config');
const {transparentGetter, requireFileGetter} = require('@brillout/global-config/utils');

const packageName = require('./package.json').name;

const buildFile = require.resolve('./executeBuild');
const buildFile__ejected = 'PROJECT_ROOT/build/index.js';

const getBuildInfo = require('./getBuildInfo');
const getBuildInfoFile = require.resolve('./getBuildInfo');
const getBuildInfo_ejectedPath = 'PROJECT_ROOT/build/getBuildInfo.js';

const buildEjectName = 'build';
const staticRenderingEjectName = 'build-static-rendering';
const browserEntriesEjectName = 'build-browser-entries';

globalConfig.$addConfig({
    $name: packageName,
    buildFile,
    getBuildInfo,
    ejectables: getEjectables(),
});
// remove requireFileGetter because overkill?
globalConfig.$addGetter(requireFileGetter('buildFile', 'runBuild'));
globalConfig.$addGetter(transparentGetter('getBuildInfo'));

function getEjectables() {
    return [
        {
            name: buildEjectName,
            description: 'Eject build code.',
            configChanges: [
                {
                    configPath: 'buildFile',
                    newConfigValue: buildFile__ejected,
                },
                {
                    configPath: 'getBuildInfo',
                    newConfigValue: getBuildInfo_ejectedPath,
                },
            ],
            fileCopies: [
                {
                    noDependerRequired: true,
                    oldPath: buildFile,
                    newPath: buildFile__ejected,
                },
                {
                    noDependerRequired: true,
                    oldPath: getBuildInfoFile,
                    newPath: getBuildInfo_ejectedPath,
                },
            ],
        },
        {
            name: staticRenderingEjectName,
            description: 'Eject code that renders static HTMLs.',
            fileCopies: [
                {
                    oldPath: packageName+'/getPageHTMLs',
                    newPath: 'PROJECT_ROOT/build/getPageHTMLs.js',
                    noDependerMessage: (
                        'Did you run `eject '+buildEjectName+'` before running `eject '+staticRenderingEjectName+'`?\n'+
                        'Did you run `eject '+staticRenderingEjectName+'` already?'
                    ),
                },
            ],
        },
        {
            name: browserEntriesEjectName,
            description: 'Eject code that generates the browser entry of each page.',
            fileCopies: [
                {
                    oldPath: packageName+'/getPageBrowserEntries',
                    newPath: 'PROJECT_ROOT/build/getPageBrowserEntries.js',
                    noDependerMessage: (
                        'Did you run `eject '+buildEjectName+'` before running `eject '+browserEntriesEjectName+'`?\n'+
                        'Did you run `eject '+browserEntriesEjectName+'` already?'
                    ),
                },
            ],
        },
    ];
}
