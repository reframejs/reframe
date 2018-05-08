const Repage = require('@repage/core');
//const {hydratePage: repage_hydratePage} = require('@repage/hydratePage');
const repage_hydratePage = require('@brillout/repage/hydratePage');

module.exports = hydratePage;

async function hydratePage(page, browserConfig) {
    const repage = new Repage();

    /*
    repage.addPlugins([
        ...browserConfig.repage_plugins,
    ]);

    return await repage_hydratePage(repage, page);
    */
    await (
        repage_hydratePage({
            pageConfig: page,
            router2: browserConfig.router2,
            renderToDom2: browserConfig.renderToDom2,
        })
    );
}
