const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

const packageName = require('./package.json').name;

const serverStartFile = require.resolve('./startServer');
const koaIntegrationFile = require.resolve('./KoaIntegrationMiddleware');

module.exports = {
    $name: packageName,
    $getters: [
        transparentGetter('serverStartFile'),
        requireFileGetter('koaIntegrationFile'),
    ],
    serverStartFile,
    koaIntegrationFile,
    ejectables: getEjectables(),
};

function getEjectables() {
    const ejectName_server = 'server';
    const ejectName_serverIntegration = 'server-integration';
    return [
        {
            name: ejectName_server,
            description: 'Eject the code that creates that creates the Node.js/Koa server.',
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
            description: 'Eject the middleware that integrates Koa with Reframe',
            actions: [
                {
                    targetDir: 'server/',
                    configIsFilePath: true,
                    configPath: 'koaIntegrationFile',
                },
            ],
        },
    ];
}