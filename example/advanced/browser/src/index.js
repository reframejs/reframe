const BrowserHandler = require('@reframe/browser');
const pages = require('../../pages');

const browserHandler = new BrowserHandler({
    pages,
});

browserHandler.installBrowserRouter();

browserHandler.renderInitialPage();
