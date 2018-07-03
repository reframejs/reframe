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

    browserInitFiles: [
        {
            name: 'hydratePage',
            initFile: hydratePageFile,
            doNotInclude: ({pageConfig}) => !!pageConfig.doNotRenderInBrowser,
            // -50 is fairly aggressive to ensure that hydration is
            // one of the first thing that happens in the browser
            executionOrder: -50,
        }
    ],

    ejectables: [
        {
            name: 'browser',
            description: 'Eject the browser initialization code.',
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
            description: 'Eject the code that hydrates the page (which renders the page to the DOM).',
            actions: [
                {
                    targetDir: 'browser/',
                    configPath: 'httpRequestHandlerFiles',
                    configIsList: true,
                    listElementKeyProp: 'name',
                    listElementKey: 'hydratePage',
                    newConfigValue: ({copyCode, oldConfigValue}) => ({
                        ...oldConfigValue,
                        initFile: copyCode(oldConfigValue.initFile),
                    }),
                }
            ],
        },
    ],
};
