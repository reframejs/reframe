const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const {compute_source_code_hash} = require('./utils/compute_source_code_hash');

const {getPageHtml} = require('@repage/server');


module.exports = {HapiPlugin_ServerRendering__create};


function HapiPlugin_ServerRendering__create(getRepageObject) {

    return {
        name: 'reframe-server-rendering',
        multiple: false,
        register,
    };

    function register(server, options) {
        server.ext('onPreResponse', (request, h) =>
            handle_request(request, h, getRepageObject)
        );
    }
}

async function handle_request(request, h, getRepageObject) {
    if( request_is_already_served(request) ) {
        return h.continue;
    }

    const repage_object = getRepageObject();

    const html = await compute_html(request, repage_object);

    if( html === null ) {
        return h.continue;
    }

    const response = compute_response(html, h);
    return response;
}

async function compute_html(request, repage_object) {
    const uri = request.url.href;
    assert_internal(uri && uri.constructor===String, uri);

    let {html, renderToHtmlIsMissing} = await getPageHtml(repage_object, uri, {canBeNull: true});
    assert_html(html, renderToHtmlIsMissing);

    return html;
}

function compute_response(html, h) {
    const response = h.response(html);
    response.type('text/html');
    add_etag_header(response);
    return response;
}

function add_etag_header(response) {
    response.etag(compute_source_code_hash(response.source));
}

function request_is_already_served() {
    return (
        ! request.response.isBoom ||
        request.response.output.statusCode !== 404
    );
}

function assert_html(html, renderToHtmlIsMissing) {
    assert_internal(html === null || html && html.constructor===String, html);

    assert_internal([true, false].includes(renderToHtmlIsMissing));
    assert_internal(!renderToHtmlIsMissing || html===null);
    assert_usage(renderToHtmlIsMissing===false);
}
