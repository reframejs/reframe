const renderToDomFile = require.resolve('./renderToDom');
const renderToHtmlFile = require.resolve('./renderToHtml');
const webpackBrowserConfig = require('./webpackBrowserConfig');
const webpackNodejsConfig = require('./webpackNodejsConfig');
const $getters = require('@reframe/react/getters');
const $name = require('./package.json').name;

module.exports = {
    $name,
    $getters,

    renderToHtmlFile,

    renderToDomFile,
    browserConfigs: ['renderToDomFile'],

    webpackBrowserConfig,
    webpackNodejsConfig,

    ejectables: [
        {
            name: 'renderer',
            description: 'Eject the React Native Web renderer.',
            actions: [
                {
                    targetDir: 'renderer/',
                    configIsFilePath: true,
                    configPath: 'renderToDomFile',
                },
                {
                    targetDir: 'renderer/',
                    configIsFilePath: true,
                    configPath: 'renderToHtmlFile',
                },
            ],
        }
    ],
};
