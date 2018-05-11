const React = require('react');
const ReactDOM = require('react-dom');
const containerId = 'root-react';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps, browserConfig}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);

    reactElement = applyViewWrappers(reactElement, initialProps, browserConfig);

    const container = document.getElementById(containerId);

    ReactDOM.hydrate(reactElement, container);
}

function applyViewWrappers(reactElement, initialProps, projectConfig) {
    projectConfig.viewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });

    return reactElement;
}
