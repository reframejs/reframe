const assert = require('reassert');
const assert_usage = assert;

const Repage = require('@repage/core');
const {hydratePage: repage_hydratePage} = require('@repage/browser');

const RepageRouterCrossroads = require('@repage/router-crossroads/browser');
const RepageRenderer = require('@repage/renderer/browser');
const RepageRendererReact = require('@repage/renderer-react/browser');
const RepageNavigator = require('@repage/navigator/browser');

module.exports = hydratePage;

async function hydratePage(page) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
        RepageNavigator,
    ]);

    return await repage_hydratePage(repage, page);
}
