const assert = require('reassert');
const assert_usage = assert;

const Repage = require('@repage/core/browser');

const RepageRouterCrossroads = require('@repage/router-crossroads/browser');
const RepageRenderer = require('@repage/renderer/browser');
const RepageRendererReact = require('@repage/renderer-react/browser');
const RepageNavigatorHistory = require('@repage/navigator-history/browser');
const RepagePageTransition = require('@repage/page-transition/browser');
const RepagePageTransitionNprogress = require('@repage/page-transition-nprogress/browser');

module.exports = BrowserHandler;

function BrowserHandler({pages}={}) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads(),
        RepageRenderer(),
        RepageRendererReact(),
        RepageNavigatorHistory(),
        RepagePageTransition(),
        RepagePageTransitionNprogress(),
    ]);

    repage.addPages(pages);

    return {
        installBrowserRouter: repage.makeLinksDynamic,
        renderInitialPage: repage.renderInitialPage,
    };
}
