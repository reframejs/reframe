const React = require('react');
const ReactDOM = require('react-dom');
const browserConfig = require('@reframe/browser/browserConfig');
const containerId = 'root-react';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);

    reactElement = applyViewWrappers(reactElement, initialProps);

    const container = document.getElementById(containerId);

    ReactDOM.hydrate(reactElement, container);
}

function applyViewWrappers(reactElement, initialProps) {
    const {browserViewWrappers} = browserConfig;

    browserViewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });

    return reactElement;
}
