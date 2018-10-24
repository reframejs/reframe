const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

const packageName = require('./package.json').name;

const serverStartFile = require.resolve('./start');
const hapiIntegrationPluginFile = require.resolve('./hapiIntegrationPlugin');

module.exports = {
    $name: packageName,
    $getters: [
        transparentGetter('serverStartFile'),
        requireFileGetter('hapiIntegrationPluginFile'),
    ],
    serverStartFile,
    hapiIntegrationPluginFile,
    ejectables: getEjectables(),
};


function getEjectables() {
    const ejectName_server = 'server';
    const ejectName_serverIntegration = 'server-integration';
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
        {
            name: ejectName_serverIntegration,
            description: 'Eject the hapi plugin that integrates hapi with Reframe.',
            actions: [
                {
                    targetDir: 'server/',
                    configIsFilePath: true,
                    configPath: 'hapiIntegrationPluginFile',
                },
            ],
        },
    ];
}
