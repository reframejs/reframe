const BrowserHandler = require('@reframe/core/browser');

const pages = [
    require('./CounterPage.html.js'),
];

const browserHandler = new BrowserHandler({pages});

(async () => {
    await browserHandler.waitInit();

    browserHandler.installBrowserRouter();

    browserHandler.renderInitialPage();
})();

