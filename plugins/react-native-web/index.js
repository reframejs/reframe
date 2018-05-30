const renderToHtml = require('./renderToHtml');
const webpackBrowserConfig = require('./webpackBrowserConfig');
const webpackNodejsConfig = require('./webpackNodejsConfig');
const $getters = require('@reframe/react/getters');

module.exports = {
    $name: require('./package.json').name,
    $getters,
    renderToDomFile: require.resolve('./renderToDom'),
    webpackBrowserConfig,
    webpackNodejsConfig,
    renderToHtml,
};
