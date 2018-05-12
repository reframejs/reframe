const getProjectBrowserConfig = require('@reframe/utils/process-config/getProjectBrowserConfig');
const hydratePage__repage = require('@brillout/repage/hydratePage');

module.exports = hydratePage;

async function hydratePage(pageConfig) {
    const projectBrowserConfig = getProjectBrowserConfig();

    const {renderToDom, router, currentPageConfig} = projectBrowserConfig;

    await (
        hydratePage__repage({
            pageConfig: pageConfig || currentPageConfig,
            router,
            renderToDom,
        })
    );
}
