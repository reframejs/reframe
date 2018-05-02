const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const {compute_file_hash} = require('@reframe/utils/compute_file_hash');
const {getPageHtml} = require('@repage/server');
const Repage = require('@repage/core');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

const HapiPluginServerRendering = {
    name: 'ReframeServerRendering',
    multiple: false,
    register,
};

module.exports = HapiPluginServerRendering;

function register(server, options) {
    server.ext('onPreResponse', (request, h) =>
        handle_request(request, h)
    );
}

async function handle_request(request, h) {
    if( request_is_already_served(request) ) {
        return h.continue;
    }

    const repage_object = create_repage_object();

    const html = await compute_html(request, repage_object);

    if( html === null ) {
        return h.continue;
    }

    const response = compute_response(html, h);
    return response;
}

function create_repage_object() {
    const projectConfig = getProjectConfig();

    const {repage_plugins} = projectConfig;
    assert_internal(repage_plugins.constructor===Array);

    const {pageConfigs} = require(projectConfig.build.getBuildInfo)();
    assert_internal(pageConfigs.constructor===Array);

    const repage_object = new Repage();
    repage_object.addPlugins(repage_plugins);
    repage_object.addPages(pageConfigs);

    return repage_object;
}

async function compute_html(request, repage_object) {
    const uri = request.url.href;
    assert_internal(uri && uri.constructor===String, uri);

    let {html, renderToHtmlIsMissing} = await getPageHtml(repage_object, uri, {canBeNull: true});
    assert_html(html, renderToHtmlIsMissing);

    return html;
}

function compute_response(html, h) {
    const etag = compute_file_hash(html);
    const response_304 = (
        h.entity({
            etag,
        })
    );
    if( response_304 ) {
        return response_304;
    }
    const response_200 = h.response(html);
    response_200.etag(etag);
    response_200.type('text/html');
    return response_200;
}

function request_is_already_served(request) {
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
