import browserConfig from '@brillout/browser-config';

runBrowserCode();

async function runBrowserCode() {
    await browserConfig.hydratePage();
}
