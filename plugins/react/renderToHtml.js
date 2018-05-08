const {containerId, getReactElement} = require('./common');
const ReactDOMServer = require('react-dom/server');
const HtmlCrust = require('@brillout/html-crust');

module.exports = renderToHtml;

function renderToHtml({pageConfig, initialProps}) {
    const reactElement = getReactElement({pageConfig, initialProps});

    const div = ReactDOMServer.renderToStaticMarkup(reactElement);
    const body = '<div id="'+containerId+'">'+div+'</div>';

    const html = HtmlCrust.renderToHtml(Object.assign({}, pageConfig, {body}));

    return html;
}
