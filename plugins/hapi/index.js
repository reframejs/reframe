const {transparentGetter} = require('@brillout/reconfig/utils');

const packageName = require('./package.json').name;

const serverStartFile = require.resolve('./start');
const serverStartFile_ejectedPath = 'PROJECT_ROOT/server/index.js';

module.exports = {
    $name: packageName,
    $getters: [
        transparentGetter('serverStartFile'),
    ],
    requestHandlers: [
        StaticAssets,
        serverRendering,
    ],
    serverStartFile,
    ejectables: getEjectables(),
};


function getEjectables() {
    return [
        {
            name: 'server',
            description: 'Eject the hapi server code.',
            configChanges: [
                {
                    configPath: 'serverStartFile',
                    newConfigValue: serverStartFile_ejectedPath,
                },
            ],
            fileCopies: [
                {
                    noDependerRequired: true,
                    oldPath: serverStartFile,
                    newPath: serverStartFile_ejectedPath,
                },
            ],
        },
    ];
}
