const Repage = require('@repage/core');
const {hydratePage: repage_hydratePage} = require('@repage/browser');

const {processReframeBrowserConfig} = require('@reframe/utils/processReframeBrowserConfig');

const RepageRouterCrossroads = require('@repage/router-crossroads/browser');
const RepageRenderer = require('@repage/renderer/browser');
const RepageRendererReact = require('@repage/renderer-react/browser');
const RepageNavigator = require('@repage/navigator/browser');

module.exports = hydratePage;

async function hydratePage(page, reframeBrowserConfig) {
    processReframeBrowserConfig(reframeBrowserConfig);

    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
        RepageNavigator,
        ...reframeBrowserConfig._processed.repage_plugins,
    ]);

    return await repage_hydratePage(repage, page);
}
