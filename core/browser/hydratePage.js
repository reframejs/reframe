const {processReframeBrowserConfig} = require('@reframe/utils/processReframeConfig/processReframeBrowserConfig');

const Repage = require('@repage/core');
const {hydratePage: repage_hydratePage} = require('@repage/browser');

module.exports = hydratePage;

async function hydratePage(page, reframeBrowserConfig={}) {
    processReframeBrowserConfig(reframeBrowserConfig);

    const repage = new Repage();

    repage.addPlugins([
        ...reframeBrowserConfig._processed.repage_plugins,
    ]);

    return await repage_hydratePage(repage, page);
}
