const assert = require('reassert');
const assert_usage = assert;
const Repage = require('@repage/core/browser');
const RepageRender = require('@repage/render/browser');
const RepageRenderReact = require('@repage/render-react/browser');
const {initializeRepage} = require('./common');

module.exports = BrowserHandler;

function BrowserHandler({pages}={}) {
    const repage = new Repage();
    initializeRepage({
        repage,
        pages,
        plugins: [
            RepageRender,
            RepageRenderReact,
        ],
    });

    return {
        installBrowserRouter: repage.makeLinksDynamic,
        renderInitialPage: repage.renderInitialPage,
    };
}
