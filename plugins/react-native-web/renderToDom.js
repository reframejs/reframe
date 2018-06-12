const {AppRegistry} = require('react-native-web');
const browserConfig = require('@brillout/browser-config');
const {CONTAINER_ID, getReactElement} = require('@reframe/react/common');

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const viewWrappers = browserConfig.browserViewWrappers;
    const reactElement = getReactElement({
        pageConfig,
        initialProps,
        viewWrappers,
    });

    AppRegistry.registerComponent('App', () => () => reactElement);

    AppRegistry.runApplication('App', {
        initialProps,
        rootTag: document.getElementById(CONTAINER_ID),
    });
}
