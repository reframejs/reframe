const assert = require('reassert');
const assert_usage = assert;
const Repage = require('@repage/core/server');
const renderToHtml = require('@repage/renderer-react/renderToHtml');
const {initializeRepage} = require('./common');

module.exports = {HapiServerRedering: HapiServerRedering()};

function HapiServerRedering() {
    return {
        name: 'reframe-server-rendering',
        multiple: true,
        register: (server, options) => {
            const {pages} = options;
            assert_usage(pages, options);

            const repage = new Repage();
            initializeRepage({repage, pages, defaultPageInfo: {renderToHtml}});

            server.ext('onPreResponse', preResponse);

            return;

            async function preResponse(request, h) {
                if( ! request.response.isBoom || request.response.output.statusCode !== 404 ) {
                    return h.continue;
                }

                const uri = request.url.href;
                assert(uri && uri.constructor===String, uri);

                const html = await repage.getPageHtml({uri, canBeNull: true});
                assert(html === null || html && html.constructor===String, html);

                if( html === null ) {
                    return h.continue;
                }

                return h.response(html).type('text/html');
            }
        },
    };

}
