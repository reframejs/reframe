const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

const packageName = require('./package.json').name;

const serverStartFile = require.resolve('./startServer');
const koaIntegrationPluginFile = require.resolve('./KoaIntegrationMiddleware');

module.exports = {
    $name: packageName,
    $getters: [
        transparentGetter('serverStartFile'),
        requireFileGetter('koaIntegrationPluginFile'),
    ],
    serverStartFile,
    koaIntegrationPluginFile,
    ejectables: getEjectables(),
};

function getEjectables() {
    const ejectName_server = 'server';
    const ejectName_serverIntegration = 'server-integration';
    return [
        {
            name: ejectName_server,
            description: 'Eject the code that creates the Node.js/example server.',
            listingPrio: 100,
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
            description: 'Eject the example plugin that integrates example with Reframe.',
            actions: [
                {
                    targetDir: 'server/',
                    configIsFilePath: true,
                    configPath: 'koaIntegrationPluginFile',
                },
            ],
        },
    ];
}