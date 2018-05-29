const React = require('react');
const {AppRegistry} = require('react-native-web');
const browserConfig = require('@reframe/browser/browserConfig');
const containerId = 'root-react';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    let App = pageConfig.view;

    App = applyViewWrappers(App, initialProps);

    AppRegistry.registerComponent('App', () => App);

    AppRegistry.runApplication('App', {
        initialProps,
        rootTag: document.getElementById(containerId),
    });
}

function applyViewWrappers(App, initialProps) {
    const {browserViewWrappers} = browserConfig;

    browserViewWrappers
    .forEach(viewWrapper => {
        const wrappee = App;
        App = () => viewWrapper(React.createElement(wrappee, initialProps), initialProps);
    });

    return App;
}
