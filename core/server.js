const Repage = require('@repage/core/server');
const renderToHtml = require('@repage/renderer-react/renderToHtml');

module.exports = {HapiReframe: HapiReframe()};

function HapiReframe() {
    return {
        register: (server, options) => {
            const {pages} = options;
            assert_usage(pages);

            const repage = new Repage();
            initializeRepage({repage, pages, defaultPageInfo: {renderToHtml}});

            server.ext('onPreResponse', preResponse);
        },
    };

    function preResponse(request, h) {
        const {response} = request;
        if( ! response.isBoom ) {
            return h.continue;
        }

        const uri = request.url.href;

        const html = repage.getPageHtml({uri, canBeNull: true});

        if( html === null ) {
            return h.continue;
        }

        const resp = h.response(html).type('text/html');
        return resp;
    }
}
