const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const ReactDOMServer = require('react-dom/server');
const HtmlCrust = require('@brillout/html-crust');
const {loadData, get_views, get_initial_props} = require('./common');

module.exports = {
    name: require('./package.json').name,
    pageMixin: {
        renderHtmlLoad: [
            loadData,
        ],
        renderHtmlApply: [
            renderHtmlApply,
        ],
    },
};

function renderHtmlApply ({page, renderHtmlContext, route}) {
    const initial_props = get_initial_props(route, renderHtmlContext);

    const views = get_views({page, initial_props});

    assert_usage(
        views.length<2,
        page,
        "The page printed above has more than one view. But multiple views only make sense in the browser."
    );

    const body_html = get_body_html(views);

    const html = HtmlCrust.renderToHtml(Object.assign({}, page, {body: body_html}));

    renderHtmlContext.html = html;
}

function get_body_html(views) {
    if( views.length===0 ) {
        return '';
    }

    const {react_element, container_id} = views[0];
    assert_internal(react_element);
    assert_internal(container_id);

    let body_html = ReactDOMServer.renderToStaticMarkup(react_element);
    body_html = '<div id="'+container_id+'">'+body_html+'</div>';

    return body_html;
}
