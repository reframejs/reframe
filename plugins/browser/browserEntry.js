import browserConfig from '@brillout/browser-config';

initBrowser();

async function initBrowser() {
    await browserConfig.hydratePage();
}
