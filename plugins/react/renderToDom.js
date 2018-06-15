const ReactDOM = require('react-dom');
const browserConfig = require('@brillout/browser-config');
const {CONTAINER_ID, getReactElement} = require('./common');

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const reactElement = getReactElement({
        pageConfig,
        initialProps,
        viewWrappers: browserConfig.browserViewWrappers,
    });

    const container = document.getElementById(CONTAINER_ID);
    ReactDOM.hydrate(reactElement, container);
}
