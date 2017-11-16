const assert = require('reassert');
const assert_usage = assert;
const {makeLinksDynamic, renderInitialPage, addPages, setRouter} = require('@repage/core/browser');
const renderToDom = require('@repage/renderer-react/renderToDom');

module.exports = BrowserHandler;

function BrowserHandler({pages}={}) {
    initialize_repage({pages, default_page_info: {renderToDom}});

    return {
        installBrowserRouter: makeLinksDynamic,
        renderInitialPage,
    };
}


const RepageRouterStandard = require('@repage/router-standard');
function initialize_repage({pages, default_page_info}) {
    addPages([
        {isMixin: true, ...default_page_info},
        ...pages,
    ]);
    setRouter(RepageRouterStandard);
}
