const {containerId, getReactElement} = require('./common');
const ReactDOMServer = require('react-dom/server');
const HtmlCrust = require('@brillout/html-crust');

function renderToHtml({pageConfig, initialProps}) {

    const reactElement = getReactElement({pageConfig, initialProps});

    const div = ReactDOMServer.renderToStaticMarkup(react_element);
    const body = '<div id="'+containerId+'">'+div+'</div>';

    const html = HtmlCrust.renderToHtml(Object.assign({}, page, {body: body_html}));

    return html;
}
