const renderToHtml = require('./renderToHtml');
const webpackBrowserConfig = require('./webpackBrowserConfig');
const webpackNodejsConfig = require('./webpackNodejsConfig');
const $getters = require('./getters');
const renderToDomFile = require.resolve('./renderToDom');
const $name = require('./package.json').name;

module.exports = {
    $name,
    $getters,
    renderToDomFile,
    webpackBrowserConfig,
    webpackNodejsConfig,
    renderToHtml,
};
