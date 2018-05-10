const {AppRegistry} = require('react-native-web');
const containerId = 'root-react';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const App = pageConfig.view;

    AppRegistry.registerComponent('App', () => App);

    AppRegistry.runApplication('App', {
        initialProps,
        rootTag: document.getElementById(containerId),
    });
}
