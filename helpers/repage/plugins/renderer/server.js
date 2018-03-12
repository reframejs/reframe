const assert = require('reassert');
const assert_usage = assert;

const {run, prepare} = require('./common');

module.exports = {
    name: require('./package.json').name,
    pageMixin: {
        renderToHtml,
    },
};

async function renderToHtml(args) {
    const {page} = args;

    args = await prepare(args);

    const renderHtmlContext = {};
    args = Object.assign({renderHtmlContext}, args);

    await run(page.renderHtmlBegin, args);
    await run(page.renderHtmlLoad, args);
    await run(page.renderHtmlApply, args, true);
    await run(page.renderHtmlEnd, args);

    const {html} = renderHtmlContext;
    assert(html);
    return html;
}
