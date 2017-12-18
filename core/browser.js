const assert = require('reassert');
const assert_usage = assert;

const Repage = require('@repage/core/browser');

const RepageRouterCrossroads = require('@repage/router-crossroads/browser');
const RepageRenderer = require('@repage/renderer/browser');
const RepageRendererReact = require('@repage/renderer-react/browser');
const RepageNavigatorHistory = require('@repage/navigator-history/browser');
const RepagePageTransition = require('@repage/page-transition/browser');
const RepagePageTransitionNprogress = require('@repage/page-transition-nprogress/browser');
const RepagePageLoader = require('@repage/page-loader/browser');

module.exports = {BrowserHandler, hydratePage};

function BrowserHandler({pages}={}) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
        RepageNavigatorHistory,
        RepagePageTransition,
        RepagePageTransitionNprogress,
        RepagePageLoader,
    ]);

    repage.addPages(pages);

    return {
        waitInit: repage.waitInit,
        installBrowserRouter: repage.makeLinksDynamic,
        renderInitialPage: repage.renderInitialPage,
    };
}

async function hydratePage(page) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
        RepageNavigatorHistory,
    ]);

  //repage.addPages([page]);

    return await repage.hydratePage(page);
}
