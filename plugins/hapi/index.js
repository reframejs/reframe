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
    const ejectName_ServerIntegration = 'server-integration';
    return [
        {
            name: 'server',
            description: '[basic] Eject the code that creates the Node.js/hapi server.',
            descriptionLong: [
                'Ejects the code that creates a hapi server instance.',
                '',
                'This is the right eject if you want to for example:',
                ' - Add API endpoints',
                ' - Add routes to the server',
                ' - Change server configuration (e.g. the server port)',
                ' - Add hapi plugins',
                '',
                'If you want to use another web framework then also eject the `'+ejectName_ServerIntegration+'` ejectable, see `$ reframe help eject '+ejectName_ServerIntegration+'`.',
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
            name: ejectName_ServerIntegration,
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
