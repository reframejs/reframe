const {transparentGetter} = require('@brillout/reconfig/getters');
const $name = require('./package.json').name;
const $getters = [
    transparentGetter('browserInitFile'),
];
const browserInitFile = require.resolve('./browserInit');
const hydratePageFile = require.resolve('./hydratePage');

module.exports = {
    $name,
    $getters,

    browserInitFile,

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
                    configPath: 'browserInitFile',
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
