const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const {compute_source_code_hash} = require('./utils/compute_source_code_hash');

const {processReframeConfig} = require('@reframe/utils');

const Repage = require('@repage/core');
const {getPageHtml} = require('@repage/server');


module.exports = {HapiServerRendering__create};


function HapiServerRendering__create({getPages, reframeConfig={}}={}) {
    processReframeConfig(reframeConfig);

    return {
        name: 'reframe-server-rendering',
        multiple: false,
        register: (server, options) => {
            const {getRepage, doNotComputeEtag} = options;
            assert_usage(getPages || getRepage, options);

            let repage;
            let pages;

            server.ext('onPreResponse', onPreResponse);

            return;

            async function onPreResponse(request, h) {
                if( request_is_already_served(request) ) {
                    return h.continue;
                }

                init_repage_object();

                const html = await compute_html(request, repage);

                if( html === null ) {
                    return h.continue;
                }

                return compute_response(html, doNotComputeEtag, h);
            }

            function init_repage_object() {
                if( getRepage ) {
                    const repage__new = getRepage();
                    if( repage__new === repage ) {
                        return;
                    }
                    assert_usage(repage__new, repage__new);
                    repage = repage__new;
                    return;
                }

                if( getPages ) {
                    const pages__new = getPages();
                    if( pages__new === pages ) {
                        return;
                    }
                    assert_usage(pages__new.constructor===Array, pages__new);
                    pages = pages__new;
                    repage = create_repage_object(pages);
                    return;
                }

                assert_internal(false);
            }

            function create_repage_object(pages_) {
                assert_internal(pages_);

                const repage = new Repage();
                repage.addPlugins(reframeConfig._processed.repage_plugins);
                repage.addPages(pages_);

                return repage;
            }
        },
    };
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

async function compute_html(request, repage) {
    const uri = request.url.href;
    assert_internal(uri && uri.constructor===String, uri);

    let {html, renderToHtmlIsMissing} = await getPageHtml(repage, uri, {canBeNull: true});
    assert_html(html, renderToHtmlIsMissing);

    return html;
}
