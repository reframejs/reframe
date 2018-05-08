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
    const body = '<div id="'+containerId+'">'+div+'</div>';

    const html = HtmlCrust.renderToHtml(Object.assign({}, pageConfig, {body}));

    return html;
}
