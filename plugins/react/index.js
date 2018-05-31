const renderToDomFile = require.resolve('./renderToDom');
const renderToHtmlFile = require.resolve('./renderToHtml');
const webpackBrowserConfig = require('./webpackBrowserConfig');
const webpackNodejsConfig = require('./webpackNodejsConfig');
const $getters = require('./getters');
const $name = require('./package.json').name;

module.exports = {
    $name,
    $getters,
    renderToDomFile,
    renderToHtmlFile,
    webpackBrowserConfig,
    webpackNodejsConfig,
};
