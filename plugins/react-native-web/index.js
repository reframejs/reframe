module.exports = reactNativeWeb;

function reactNativeWeb() {
    const renderToHtml = require('./renderToHtml');
    const webpackBrowserConfig = require('./webpackBrowserConfig');
    const webpackNodejsConfig = require('./webpackNodejsConfig');

    return {
        name: require('./package.json').name,
        browserConfigFile: require.resolve('./browser.js'),
        webpackBrowserConfig,
        webpackNodejsConfig,
        renderToHtml,
    };

}

