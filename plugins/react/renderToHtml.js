const React = require('react');
const ReactDOMServer = require('react-dom/server');
const HtmlCrust = require('@brillout/html-crust');
const containerId = 'root-react';

module.exports = renderToHtml;

function renderToHtml({pageConfig, initialProps}) {
    const reactElement = React.createElement(pageConfig.view, initialProps);

    const div = ReactDOMServer.renderToStaticMarkup(reactElement);

    const htmlCrustOptions = Object.assign({bodyHtmls: []}, pageConfig);
    htmlCrustOptions.bodyHtmls.push('<div id="'+containerId+'">'+div+'</div>');

    const html = HtmlCrust(htmlCrustOptions);

    return html;
}
