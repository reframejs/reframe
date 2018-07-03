import browserConfig from '@brillout/browser-config';

initBrowser();

async function initBrowser() {
    // Include pre-init code here

    // Plugins can add init functions
    // For example:
    //  - page hydration (i.e. rendering of the page to the DOM)
    //  - user tracking initialization
    for(const initFunction of Object.values(browserConfig.initFunctions)) {
        await initFunction();
    }

    // Include post-init code here
}
