const React = require('react');
const ReactDOM = require('react-dom');
const getProjectBrowserConfig = require('@reframe/utils/process-config/getProjectBrowserConfig');
const containerId = 'root-react';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);

    reactElement = applyViewWrappers(reactElement, initialProps);

    const container = document.getElementById(containerId);

    ReactDOM.hydrate(reactElement, container);
}

function applyViewWrappers(reactElement, initialProps) {
    const projectBrowserConfig = getProjectBrowserConfig();

    const {viewWrappers} = projectBrowserConfig;

    viewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });

    return reactElement;
}
