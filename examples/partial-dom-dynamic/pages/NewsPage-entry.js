import hydratePage from '@reframe/browser/hydratePage';
import NewsBrowserConfigPage from './NewsPage-browser-config.js';

console.log("before partial hydration");

(async () => {
    await hydratePage(NewsBrowserConfigPage);

    console.log("after partial hydration");
})();
