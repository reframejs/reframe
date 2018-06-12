const {transparentGetter} = require('@brillout/reconfig/getters');
const $name = require('./package.json').name;
const $getters = [
    transparentGetter('browserEntryFile'),
];
const browserEntryFile = require.resolve('./browserEntry');
const hydratePageFile = require.resolve('./hydratePage');

module.exports = {
    $name,
    $getters,

    browserEntryFile,

    hydratePageFile,
    browserConfigs: ['hydratePageFile'],

    ejectables: [
        {
            name: 'browser',
            description: 'Eject the default browser entry code.',
            actions: [
                {
                    targetDir: 'browser/',
                    configIsFilePath: true,
                    configPath: 'browserEntryFile',
                },
            ],
        },
        {
            name: 'browser-hydration',
            description: 'Eject hydration code.',
            actions: [
                {
                    targetDir: 'browser/',
                    configIsFilePath: true,
                    configPath: 'hydratePageFile',
                },
            ],
        },
    ],
};
