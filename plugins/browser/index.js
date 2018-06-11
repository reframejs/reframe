const {transparentGetter} = require('@brillout/reconfig/getters');
const $name = require('./package.json').name;
const $getters = [
    transparentGetter('browserEntryFile'),
];

module.exports = {
    $name,
    $getters,
    browserEntryFile: require.resolve('./browserEntry'),
    ejectables: [
        {
            name: 'browser-entry',
            description: 'TODO',
            actions: [
                {
                    targetDir: 'browser/',
                    configIsFilePath: true,
                    configPath: 'browserEntryFile',
                },
            ],
        }
    ],
};
