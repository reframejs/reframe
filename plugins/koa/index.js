const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');

const packageName = require('./package.json').name;

const serverStartFile = require.resolve('./startServer');
const koaIntegrationPluginFile = require.resolve('./koaintegrationplugin');

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
            description: 'Eject the code that creates the Node.js/koa server.',
            descriptionLong: [
                'Ejects the code that creates a koa server instance.',
                '',
                'This is a very common ejectable and we strongly encourage you to eject it.',
                '',
                'This is the right eject if you want to for example:',
                ' - Add API endpoints',
                ' - Add routes to the server',
                ' - Change server configuration (e.g. the server port)',
                ' - Add koa plugins',
                '',
                'If you want to use another web framework instead of koa, then also eject the `'+ ejectName_serverIntegration+'` ejectable, see `$ reframe help eject '+ejectName_serverIntegration+'`.',
            ].join('\n'),
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
            description: 'Eject the koa plugin that integrates koa with Reframe.',
            descriptionLong: [
                'Ejects the koa plugin that implements the koa <-> Reframe integration.',
                '',
                "This is an uncommon ejectable and chances are that you will never have to eject it.",
                'However, it can be useful if you want to fully customize the server.',
                'E.g. if you want to use another web framework instead of koa.',
                '',
                'If you just want to make changes to the koa server, then run `$ reframe eject '+ejectName_server+'` instead.'
            ].join('\n'),
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