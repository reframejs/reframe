const {containerId, getReactElement} = require('./common');
const ReactDOM = require('react-dom');

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const reactElement = getReactElement({pageConfig, initialProps});

    const container = get_or_create_container(containerId);

    await render(reactElement, container);
}

// TODO: always assume that page is already rendered to HTML

async function render(reactElement, container) {
    const isAlreadyRendered = container.firstChild !== null;

    if( isAlreadyRendered ) {
        ReactDOM.hydrate(reactElement, container);
    } else {
        ReactDOM.render(reactElement, container);
    }
}

function get_or_create_container(containerId) {
    let container = document.getElementById(containerId);
    if( ! container ) {
        container = create_dom_element({domId: containerId});
    }
    return container;
}

function create_dom_element({domId}) {
    const el = document.createElement('div');
    el.id = domId;
    const firstChild = document.body.firstChild;
    if( ! firstChild ) {
        document.body.appendChild(el);
    } else {
        document.body.insertBefore(el, firstChild);
    }
    return el;
}
