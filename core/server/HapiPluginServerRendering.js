const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const {compute_file_hash} = require('@reframe/utils/compute_file_hash');
const {getPageHtml} = require('@repage/server');
const {processReframeConfig} = require('@reframe/utils/processReframeConfig/processReframeConfig');
const Repage = require('@repage/core');


module.exports = {HapiPluginServerRendering__create};


function HapiPluginServerRendering__create(build_state, reframeConfig) {
    const repage_plugins = get_repage_plugins(reframeConfig);

    const cache = {};
    const getRepageObject = () => get_repage_object(build_state.pages, cache, repage_plugins);

    const HapiPluginServerRendering = create_hapi_plugin(getRepageObject);
    return HapiPluginServerRendering;
}

function get_repage_plugins(reframeConfig) {
    processReframeConfig(reframeConfig);
    const {repage_plugins} = reframeConfig._processed;
    assert_internal(repage_plugins.constructor===Array);
    return repage_plugins;
}

function create_repage_object(pages, repage_plugins) {
    assert_internal(pages);

    const repage_object = new Repage();
    repage_object.addPlugins(repage_plugins);
    repage_object.addPages(pages);

    return repage_object;
}

function get_repage_object(pages, cache, repage_plugins) {
    assert_internal(pages.constructor===Array, pages);
    if( pages !== cache.pages ) {
        cache.pages = pages;
        cache.repage_object = create_repage_object(pages, repage_plugins);
    }

    assert_internal(cache.repage_object.isRepageObject);
    return cache.repage_object;
}

function create_hapi_plugin(getRepageObject) {

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
