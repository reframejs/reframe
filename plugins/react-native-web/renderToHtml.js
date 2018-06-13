const ReactDOMServer = require('react-dom/server');
const generateHtml = require('@brillout/index-html');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {AppRegistry} = require('react-native-web');
const {CONTAINER_ID, getReactElement} = require('@reframe/react/common');

module.exports = renderToHtml;

async function renderToHtml({pageConfig, initialProps}) {
    const reactElement = getReactElement({
        pageConfig,
        initialProps,
        viewWrappers: config.nodejsViewWrappers,
    });

    AppRegistry.registerComponent('App', () => () => reactElement);

    const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps });

    const div = ReactDOMServer.renderToStaticMarkup(element);

    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    const htmlOptions = Object.assign({headHtmls: [], bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push('<div id="'+CONTAINER_ID+'">'+div+'</div>');
    htmlOptions.headHtmls.push(css);

    const html = generateHtml(htmlOptions);

    return html;
}
