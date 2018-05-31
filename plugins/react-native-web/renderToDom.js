const {AppRegistry} = require('react-native-web');
const browserConfig = require('@reframe/browser/browserConfig');
const {CONTAINER_ID, getReactComponent} = require('./common');

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const viewWrappers = browserConfig.browserViewWrappers;
    const App = getReactComponent({
        pageConfig,
        initialProps,
        viewWrappers,
    });

    AppRegistry.registerComponent('App', () => App);

    AppRegistry.runApplication('App', {
        initialProps,
        rootTag: document.getElementById(CONTAINER_ID),
    });
}
