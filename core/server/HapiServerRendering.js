const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

const Repage = require('@repage/core/server');

const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');
const RepagePageLoader = require('@repage/page-loader');


const HapiServerRendering = {
    name: 'reframe-server-rendering',
    multiple: true,
    register: (server, options) => {
        const {getRepage, getPages} = options;
        assert_usage(getPages || getRepage, options);

        let repage;
        let pages;

        server.ext('onPreResponse', onPreResponse);

        return;

        async function onPreResponse(request, h) {
            if( ! request.response.isBoom || request.response.output.statusCode !== 404 ) {
                return h.continue;
            }

            const uri = request.url.href;
            assert_internal(uri && uri.constructor===String, uri);

            await init_repage_object();

            let {html, renderToHtmlIsMissing} = await repage.getPageHtml({uri, canBeNull: true});
            assert_internal(html === null || html && html.constructor===String, html);

            assert_internal([true, false].includes(renderToHtmlIsMissing));
            assert_internal(!renderToHtmlIsMissing || html===null);
            assert_usage(renderToHtmlIsMissing===false);

            if( html === null ) {
                return h.continue;
            }

            return h.response(html).type('text/html');
        }

        async function init_repage_object() {
            if( getRepage ) {
                const repage__new = getRepage();
                if( repage__new === repage ) {
                    return;
                }
                assert_usage(repage__new, repage__new);
                repage = repage__new;
                await repage.waitInit();
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
                await repage.waitInit();
                return;
            }

            assert_internal(false);
        }

        function create_repage_object(pages_) {
            assert_internal(pages_);

            const repage = new Repage();

            repage.addPlugins([
                RepageRouterCrossroads,
                RepageRenderer,
                RepageRendererReact,
                RepagePageLoader,
            ]);

            repage.addPages(pages_);

            return repage;
        }
    },
};

module.exports = {HapiServerRendering};
