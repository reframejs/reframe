const {transparentGetter, requireFileGetter} = require('@brillout/reconfig/getters');
const packageName = require('./package.json').name;
const serverEntryFile = require.resolve('./start');

module.exports = {
    $name: packageName,
    $getters: [
        transparentGetter('serverEntryFile'),
    ],
    serverEntryFile,
    ejectables: getEjectables(),
};

function getEjectables() {
    const ejectName_server = 'server';
    return [
        {
            name: ejectName_server,
            description: 'Eject the code that creates the Node.js/Express server.',
            actions: [
                {
                    targetDir: 'server/',
                    configIsFilePath: true,
                    configPath: 'serverEntryFile',
                },
            ],
        },
    ];
}
