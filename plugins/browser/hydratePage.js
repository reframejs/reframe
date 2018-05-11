const repage_hydratePage = require('@brillout/repage/hydratePage');

module.exports = hydratePage;

async function hydratePage(pageConfig, browserConfig) {
    const {renderToDom, router} = browserConfig;
    await (
        repage_hydratePage({
            pageConfig,
            router,
            renderToDom,
// TODO - remove browserConfig
            browserConfig,
        })
    );
}
