const assert = require('reassert');
const assert_usage = assert;
const Repage = require('@repage/core/browser');
const renderToDom = require('@repage/renderer-react/renderToDom');
const {initializeRepage} = require('./common');

module.exports = BrowserHandler;

function BrowserHandler({pages}={}) {
    const repage = new Repage();
    initializeRepage({repage, pages, defaultPageInfo: {renderToDom}});

    return {
        installBrowserRouter: repage.makeLinksDynamic,
        renderInitialPage: repage.renderInitialPage,
    };
}
