const {containerId} = require('./common');
const ReactDOMServer = require('react-dom/server');
const HtmlCrust = require('@brillout/html-crust');
const {AppRegistry} = require('react-native-web');

module.exports = renderToHtml;

function renderToHtml({pageConfig, initialProps}) {
    const App = pageConfig.view;

    AppRegistry.registerComponent('App', () => App)

    const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps });

    const div = ReactDOMServer.renderToStaticMarkup(element);

    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    const body = '<div id="'+containerId+'">'+div+'</div>';
    const htmlCrustOptions = Object.assign({inlineStyles: []}, pageConfig, {body});
    htmlCrustOptions.inlineStyles.push(css);

    const html = HtmlCrust(htmlCrustOptions);

    return html;
}
