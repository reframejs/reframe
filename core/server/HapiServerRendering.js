const assert = require('reassert');
const assert_usage = assert;
const Repage = require('@repage/core/server');
const renderToHtml = require('@repage/renderer-react/renderToHtml');
const {initializeRepage} = require('../common');

const HapiServerRendering = {
    name: 'reframe-server-rendering',
    multiple: true,
    register: (server, options) => {
        const {buildOutput} = options;
        assert_usage(buildOutput, options);

        const pages = (() => {
            if( options.pages ) {
                return options.pages;
            } else {
                const {pages: pages_path} = buildOutput.entry_points;
                assert(pages_path, buildOutput);
                return require(pages_path);
            }
        })();
        assert_usage(pages.constructor===Array);

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

            const scripts = (
                buildOutput.entry_points['main'].scripts
            );
            const styles = (
                buildOutput.entry_points['main'].styles
            );

            const html = await repage.getPageHtml({uri, canBeNull: true, scripts, styles});
            assert(html === null || html && html.constructor===String, html);

            if( html === null ) {
                return h.continue;
            }

            return h.response(html).type('text/html');
        }
    },
};

module.exports = HapiServerRendering;
