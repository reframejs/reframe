const React = require('react');
const ReactDOMServer = require('react-dom/server');
const generateHtml = require('@brillout/index-html');
const containerId = 'root-react';
const reconfig = require('@brillout/reconfig');

module.exports = renderToHtml;

function renderToHtml({pageConfig, initialProps}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);

    reactElement = applyViewWrappers(reactElement, initialProps);

    const contentHtml = ReactDOMServer.renderToStaticMarkup(reactElement);

    const html = renderHtmlCrust(contentHtml, pageConfig);

    return html;
}

function renderHtmlCrust(contentHtml, pageConfig) {
    const htmlOptions = Object.assign({bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push('<div id="'+containerId+'">'+contentHtml+'</div>');

    const html = generateHtml(htmlOptions);

    return html;
}

// TODO move comment
// We only need this for plugins that add view wrapper.
// E.g. the `@reframe/react-router` plugin adds a view wrapper to add
// the provider-components `<BrowserRouter>` and `<StaticRouter>`.
function applyViewWrappers(reactElement, initialProps) {
    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});
    reframeConfig
    .nodejsViewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });

    return reactElement;
}
