const ReactDOMServer = require('react-dom/server');
const HtmlCrust = require('@brillout/html-crust');
const {AppRegistry} = require('react-native-web');
const containerId = 'root-react';

module.exports = renderToHtml;

function renderToHtml({pageConfig, initialProps}) {
    const App = pageConfig.view;

    AppRegistry.registerComponent('App', () => App)

    const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps });

    const div = ReactDOMServer.renderToStaticMarkup(element);

    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    const htmlCrustOptions = Object.assign({headHtmls: [], bodyHtmls: []}, pageConfig);
    htmlCrustOptions.bodyHtmls.push('<div id="'+containerId+'">'+div+'</div>');
    htmlCrustOptions.headHtmls.push(css);

    const html = HtmlCrust(htmlCrustOptions);

    return html;
}
