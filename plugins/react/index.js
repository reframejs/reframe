const globalConfig = require('@brillout/global-config');
const {transparentGetter} = require('@brillout/global-config/utils');

const renderToHtml = require('./renderToHtml');
const webpackBrowserConfig = require('./webpackBrowserConfig');
const webpackNodejsConfig = require('./webpackNodejsConfig');

globalConfig.$addConfig({
    $name: require('./package.json').name,
    renderToDomFile: require.resolve('./renderToDom'),
    webpackBrowserConfig,
    webpackNodejsConfig,
    renderToHtml,
});
// TODO move
globalConfig.$addGetter(transparentGetter('renderToHtml'));
