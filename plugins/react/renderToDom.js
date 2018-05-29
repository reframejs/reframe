const React = require('react');
const ReactDOM = require('react-dom');
const getBrowserConfig = require('@reframe/browser/getBrowserConfig');
const containerId = 'root-react';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);

    reactElement = applyViewWrappers(reactElement, initialProps);

    const container = document.getElementById(containerId);

    ReactDOM.hydrate(reactElement, container);
}

function applyViewWrappers(reactElement, initialProps) {
    const browserConfig = getBrowserConfig();

    const {viewWrappers} = browserConfig;

    viewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });

    return reactElement;
}
