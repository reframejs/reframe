const HtmlCrust = require('@brillout/html-crust');

function renderToHtml() {
    const html = HtmlCrust.renderToHtml(Object.assign({}, page, {body: body_html}));
}
