const {transparentGetter} = require('@brillout/reconfig/utils');

const packageName = require('./package.json').name;

const serverStartFile = require.resolve('./start');

module.exports = {
    $name: packageName,
    $getters: [
        transparentGetter('serverStartFile'),
    ],
    serverStartFile,
    ejectables: getEjectables(),
};


function getEjectables() {
    const ejectNameServer = 'server';
    const ejectNameHapi = 'hapi';
    const ejectedPathServerStart = 'PROJECT_ROOT/server/index.js';

    return [
        {
            name: ejectNameServer,
            description: 'Eject the hapi server code.',
            configChanges: [
                {
                    configPath: 'serverStartFile',
                    newConfigValue: ejectedPathServerStart,
                },
            ],
            fileCopies: [
                {
                    noDependerRequired: true,
                    newPath: ejectedPathServerStart,
                },
            ],
        },
        {
            name: ejectNameHapi,
            description: 'Eject the `ConfigHandlers` hapi plugin that does the Reframe <-> hapi integration.',
            fileCopies: [
                {
                    oldPath: packageName+'/ConfigHandlers',
                    newPath: 'PROJECT_ROOT/server/ConfigHandlers.js',
                    noDependerMessage: (
                        'Did you eject the server before running `$ reframe eject '+ejectNameHapi+'`?\n'+
                        'In other words: Did you run `$ reframe eject '+ejectNameServer+'` already?'
                    ),
                },
            ],
        },
    ];
}
