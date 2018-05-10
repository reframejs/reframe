const React = require('react');
const ReactDOM = require('react-dom');
const containerId = 'root-react';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const reactElement = React.createElement(pageConfig.view, initialProps);

    const container = document.getElementById(containerId);

    ReactDOM.hydrate(reactElement, container);
}
