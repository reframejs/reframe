import browserConfig from '@brillout/browser-config';

import './thirdparty/jquery-3.1.1/jquery-3.1.1.min';
import './thirdparty/semantic-ui-2.1.8/semantic.min';

initBrowser();

async function initBrowser() {
    await browserConfig.hydratePage();
}
