const React = require('react');
const ReactDOMServer = require('react-dom/server');
const HtmlCrust = require('@brillout/html-crust');
const containerId = 'root-react';
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = renderToHtml;

function renderToHtml({pageConfig, initialProps}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);

    applyViewWrappers(reactElement);

    const div = ReactDOMServer.renderToStaticMarkup(reactElement);

    const htmlCrustOptions = Object.assign({bodyHtmls: []}, pageConfig);
    htmlCrustOptions.bodyHtmls.push('<div id="'+containerId+'">'+div+'</div>');

    const html = HtmlCrust(htmlCrustOptions);

    return html;
}

// We only need this for plugins that add view wrapper.
// E.g. the `@reframe/react-router` plugin adds a view wrapper to add
// the provider-components `<BrowserRouter>` and `<StaticRouter>`.
// You can remove this code if `getProjectConfig().viewWrappers.length===0`.
function applyViewWrappers(reactElement) {
    const projectConfig = getProjectConfig();

    projectConfig.viewWrappers
    .forEach(viewWrapper => {
        reactElement
    });
}
