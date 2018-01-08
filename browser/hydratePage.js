const assert = require('reassert');
const assert_usage = assert;

const Repage = require('@repage/browser');

const RepageRouterCrossroads = require('@repage/router-crossroads/browser');
const RepageRenderer = require('@repage/renderer/browser');
const RepageRendererReact = require('@repage/renderer-react/browser');
const RepageNavigatorHistory = require('@repage/navigator/browser');

module.exports = hydratePage;

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
