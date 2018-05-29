const browserConfig = require('./browserConfig');
const hydratePage__repage = require('@brillout/repage/hydratePage');

module.exports = hydratePage;

async function hydratePage(pageConfig) {
    const {renderToDom, router, currentPageConfig} = browserConfig;

    await (
        hydratePage__repage({
            pageConfig: pageConfig || currentPageConfig,
            router,
            renderToDom,
        })
    );
}
