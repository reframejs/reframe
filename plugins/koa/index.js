const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');
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
    const ejectName_serverIntegration = 'server-integration';
    return [
        {
            name: ejectName_server,
            description: 'Eject the code that creates the Node.js/Koa server.',
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
