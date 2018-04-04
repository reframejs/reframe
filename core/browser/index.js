const hydratePage = require('./hydratePage');

const browserConfig = __REFRAME__BROWSER_CONFIG;
const pageConfig = __REFRAME__PAGE_CONFIG;

(async () => {
    // Include code that needs to run before the hydration here

    await hydratePage(pageConfig, browserConfig);

    // Include code that needs to run after the hydration here
})();
