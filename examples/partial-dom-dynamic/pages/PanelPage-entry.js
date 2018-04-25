import hydratePage from '@reframe/browser/hydratePage';
import PanelBrowserConfigPage from './PanelPage-browser-config.js';

console.log("before partial hydration");

(async () => {
    await hydratePage(PanelBrowserConfigPage, __REFRAME__BROWSER_CONFIG);

    console.log("after partial hydration");
})();
