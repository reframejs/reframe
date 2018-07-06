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

    browserInitFunctions: [
        {
            name: 'hydratePage',
            initFunctionFile: hydratePageFile,
            doNotInclude: ({pageConfig}) => !!pageConfig.doNotRenderInBrowser,
            // -50 is fairly aggressive to ensure that hydration is
            // one of the first thing that happens in the browser
            executionOrder: -50,
            browserConfigsNeeded: [
                'renderToDom',
                'pageConfig',
                'router',
            ],
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
            name: 'browser-hydrate',
            description: 'Eject the code that orchestrates the hydration of the page.',
            actions: [
                {
                    targetDir: 'browser/',
                    configPath: 'browserInitFunctions',
                    configIsList: true,
                    listElementKeyProp: 'name',
                    listElementKey: 'hydratePage',
                    newConfigValue: ({copyCode, oldConfigValue}) => ({
                        ...oldConfigValue,
                        initFunctionFile: copyCode(oldConfigValue.initFunctionFile),
                    }),
                }
            ],
        },
    ],
};
