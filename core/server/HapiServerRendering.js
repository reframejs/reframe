const assert = require('reassert');
const assert_usage = assert;

const Repage = require('@repage/core/server');

const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');
const RepagePageLoader = require('@repage/page-loader');


const HapiServerRendering = {
    name: 'reframe-server-rendering',
    multiple: true,
    register: (server, options) => {
        const {pages, genericHtml} = options;
        assert_usage(pages, options);
        assert_usage(pages.constructor===Array, pages);
        assert_usage(genericHtml, options);

        const repage = new Repage();

        repage.addPlugins([
            RepageRouterCrossroads(),
            RepageRenderer(),
            RepageRendererReact(),
            RepagePageLoader(),
        ]);

        repage.addPages(pages);

        server.ext('onPreResponse', onPreResponse);

        return;

        async function onPreResponse(request, h) {
            if( ! request.response.isBoom || request.response.output.statusCode !== 404 ) {
                return h.continue;
            }

            const uri = request.url.href;
            assert(uri && uri.constructor===String, uri);

            await repage.waitInit();

            let {html, renderToHtmlIsMissing} = await repage.getPageHtml({uri, canBeNull: true});
            assert(html === null || html && html.constructor===String, html);

            assert([true, false].includes(renderToHtmlIsMissing));
            assert(!renderToHtmlIsMissing || html===null);
            if( renderToHtmlIsMissing ) {
                html = genericHtml;
            }

            if( html === null ) {
                return h.continue;
            }

            return h.response(html).type('text/html');
        }
    },
};

module.exports = HapiServerRendering;
