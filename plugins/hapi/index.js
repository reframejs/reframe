const {transparentGetter} = require('@brillout/reconfig/getters');

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
    const ejectNameHapi = 'server-hapi';
    const ejectedPathServerStart = 'PROJECT_ROOT/server/index.js';

    return [
        {
            name: ejectNameServer,
            description: 'Eject the code that creates the Node.js/hapi server.',
            configChanges: [
                {
                    configPath: 'serverStartFile',
                    newConfigValue: ({makePathRelative}) => makePathRelative(ejectedPathServerStart),
                },
            ],
            fileCopies: [
                {
                    oldPath: serverStartFile,
                    newPath: ejectedPathServerStart,
                    noDependerRequired: true,
                },
            ],
        },
        {
            name: ejectNameHapi,
            description: 'Eject the `ConfigHandlers` hapi plugin that integrates hapi with Reframe.',
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
