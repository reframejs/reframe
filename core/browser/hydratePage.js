const Repage = require('@repage/core');
const {hydratePage: repage_hydratePage} = require('@repage/browser');

module.exports = hydratePage;

async function hydratePage(page, browserConfig) {
    const repage = new Repage();

    repage.addPlugins([
        ...browserConfig.repage_plugins,
    ]);

    return await repage_hydratePage(repage, page);
}
