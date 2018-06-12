const renderToDomFile = require.resolve('./renderToDom');
const renderToHtmlFile = require.resolve('./renderToHtml');
const webpackBrowserConfig = require('./webpackBrowserConfig');
const webpackNodejsConfig = require('./webpackNodejsConfig');
const $getters = require('@reframe/react/getters');

module.exports = {
    $name: require('./package.json').name,
    $getters,

    renderToHtmlFile,

    renderToDomFile,
    browserConfigs: ['renderToDomFile'],

    webpackBrowserConfig,
    webpackNodejsConfig,
};
