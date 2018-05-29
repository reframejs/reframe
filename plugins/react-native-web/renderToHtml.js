const React = require('react');
const ReactDOMServer = require('react-dom/server');
const generateHtml = require('@brillout/index-html');
const globalConfig = require('@brillout/global-config');
const {AppRegistry} = require('react-native-web');
const containerId = 'root-react';

module.exports = renderToHtml;

function renderToHtml({pageConfig, initialProps}) {
    let App = pageConfig.view;

    App = applyViewWrappers(App, initialProps);

    AppRegistry.registerComponent('App', () => App)

    const { element, getStyleElement } = AppRegistry.getApplication('App', { initialProps });

    const div = ReactDOMServer.renderToStaticMarkup(element);

    const css = ReactDOMServer.renderToStaticMarkup(getStyleElement());

    const htmlOptions = Object.assign({headHtmls: [], bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push('<div id="'+containerId+'">'+div+'</div>');
    htmlOptions.headHtmls.push(css);

    const html = generateHtml(htmlOptions);

    return html;
}

function applyViewWrappers(App, initialProps) {
    globalConfig
    .nodejsViewWrappers
    .forEach(viewWrapper => {
        const wrappee = App;
        App = () => viewWrapper(React.createElement(wrappee, initialProps), initialProps);
    });

    return App;
}
