const hydratePage = require('./hydratePage');

const browserConfig = __REFRAME__BROWSER_CONFIG;
const pageConfig = __REFRAME__PAGE_CONFIG;

(async () => {
    // Include code here that needs to run before the hydration

    await hydratePage(pageConfig, browserConfig);

    // Include code here that needs to run after the hydration
})();

