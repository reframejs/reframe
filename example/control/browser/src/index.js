const BrowserHandler = require('@reframe/core/browser');
const pages = require('../../pages');

const page_list = window.__INTERNAL_DONT_USE__PAGES;
const browserHandler = new BrowserHandler({pages: pages(page_list)});

(async () => {
    await browserHandler.waitInit();

    browserHandler.installBrowserRouter();

    browserHandler.renderInitialPage();
})();

