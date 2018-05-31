const ReactDOMServer = require('react-dom/server');
const generateHtml = require('@brillout/index-html');
const reconfig = require('@brillout/reconfig');
const {AppRegistry} = require('react-native-web');
const {CONTAINER_ID, getReactComponent} = require('./common');

module.exports = renderToHtml;

async function renderToHtml({pageConfig, initialProps}) {
    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});
    const viewWrappers = reframeConfig.nodejsViewWrappers;
    const App = getReactComponent({
        pageConfig,
        initialProps,
        viewWrappers,
    });

    AppRegistry.registerComponent('App', () => App);

    const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps });

    const div = ReactDOMServer.renderToStaticMarkup(element);

    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    const htmlOptions = Object.assign({headHtmls: [], bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push('<div id="'+CONTAINER_ID+'">'+div+'</div>');
    htmlOptions.headHtmls.push(css);

    const html = generateHtml(htmlOptions);

    return html;
}
