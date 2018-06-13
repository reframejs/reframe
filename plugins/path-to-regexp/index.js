const $name = require('./package.json').name;
const $getters = require('./getters');
const routerFile = require.resolve('./router');

module.exports = {
    $name,
    $getters,
    routerFile,
    browserConfigs: ['routerFile'],
    ejectables: [
        {
            name: 'router',
            description: 'Eject the `@reframe/path-to-regepx` router.',
            actions: [
                {
                    targetDir: 'router/',
                    configIsFilePath: true,
                    configPath: 'routerFile',
                },
            ],
        },
    ],
};
