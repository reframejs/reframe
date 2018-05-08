const {containerId} = require('./common');
const {AppRegistry} = require('react-native');

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    // register the app
    AppRegistry.registerComponent('App', () => App);

    AppRegistry.runApplication('App', {
        initialProps: {},
        rootTag: document.getElementById(containerId),
    });
}
