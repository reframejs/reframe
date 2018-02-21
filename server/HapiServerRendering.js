const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const {compute_source_code_hash} = require('./utils/compute_source_code_hash');

const {processReframeConfig} = require('@reframe/utils');

const Repage = require('@repage/core');
const {getPageHtml} = require('@repage/server');


module.exports = {HapiServerRendering__create};


function HapiServerRendering__create({getPages, reframeConfig={}}={}) {
    const repage_plugins = get_repage_plugins(reframeConfig);

    return {
        name: 'reframe-server-rendering',
        multiple: false,
        register,
    };

    function register(server, options) {
        const {getRepage, doNotComputeEtag} = options;
        assert_options(options);

        const plugin_state = {};

        server.ext('onPreResponse', (request, h) =>
            handle_request(request, h, getRepage, getPages, repage_plugins, plugin_state)
        );
    }
}

async function handle_request(request, h, getRepage, getPages, repage_plugins, plugin_state) {
    if( request_is_already_served(request) ) {
        return h.continue;
    }

    const repage_object = get_repage_object(getRepage, getPages, repage_plugins, plugin_state);

    const html = await compute_html(request, repage_object);

    if( html === null ) {
        return h.continue;
    }

    const response = compute_response(html, doNotComputeEtag, h);
    return response;
}

function get_repage_plugins(reframeConfig) {
    processReframeConfig(reframeConfig);
    const {repage_plugins} = reframeConfig._processed;
    assert_internal(repage_plugins.constructor===Array);
    return repage_plugins;
}

function get_repage_object(getRepage, getPages, plugin_state) {
    (() => {
        if( getRepage ) {
            const repage__new = getRepage();
            if( repage__new === plugin_state.repage_object ) {
                return;
            }
            assert_usage(repage__new, repage__new);
            plugin_state.repage_object = repage__new;
            return plugin_state.repage_object;
        }

        if( getPages ) {
            const pages__new = getPages();
            if( pages__new === plugin_state.pages ) {
                return;
            }
            assert_usage(pages__new.constructor===Array, pages__new);
            plugin_state.pages = pages__new;
            plugin_state.repage_object = create_repage_object(pages__new);
            return;
        }
        assert_internal(false);
    })();

    assert_internal(plugin_state.repage_object.isRepageObject);
    return plugin_state.repage_object;
}

function create_repage_object(pages_) {
    assert_internal(pages_);

    const repage_object = new Repage();
    repage_object.addPlugins(repage_plugins);
    repage_object.addPages(pages_);

    return repage_object;
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

function compute_response(html, doNotComputeEtag, h) {
    const response = h.response(html);
    response.type('text/html');
    add_etag_header(response, doNotComputeEtag);
    return response;
}

function add_etag_header(response, doNotComputeEtag) {
    if( doNotComputeEtag ) {
        return;
    }
    response.etag(compute_source_code_hash(response.source));
}

async function compute_html(request, repage_object) {
    const uri = request.url.href;
    assert_internal(uri && uri.constructor===String, uri);

    let {html, renderToHtmlIsMissing} = await getPageHtml(repage_object, uri, {canBeNull: true});
    assert_html(html, renderToHtmlIsMissing);

    return html;
}

function assert_options(options) {
    const {getRepage, doNotComputeEtag} = options;
    assert_usage(
        getPages || getRepage,
        options,
        "Options object (which is printed above) should provide `getPages` or `getRepage`."
    );
}
