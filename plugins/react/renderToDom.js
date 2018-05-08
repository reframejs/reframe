const {containerId, getReactElement} = require('./common');
const ReactDOM = require('react-dom');

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const reactElement = getReactElement({pageConfig, initialProps});

    const container = document.getElementById(containerId);

    ReactDOM.hydrate(reactElement, container);
}
