const assert = require('reassert');
const assert_usage = assert;
const Repage = require('@repage/core/browser');
const RendererReact = require('@repage/renderer-react/browser');
const {initializeRepage} = require('./common');

module.exports = BrowserHandler;

function BrowserHandler({pages}={}) {
    const repage = new Repage();
    initializeRepage({
        repage,
        pages,
        mixins: [
            RendererReact,
        ],
    });

    return {
        installBrowserRouter: repage.makeLinksDynamic,
        renderInitialPage: repage.renderInitialPage,
    };
}
