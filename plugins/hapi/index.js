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
    const ejectName_server = 'server';
    return [
        {
            name: ejectName_server,
            description: 'Eject the code that creates the Node.js/hapi server.',
            actions: [
                {
                    targetDir: 'server/',
                    configIsFilePath: true,
                    configPath: 'serverStartFile',
                },
            ],
        },
    ];
}
