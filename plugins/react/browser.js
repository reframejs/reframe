const ReactDOM = require('react-dom');
const RepageRendererReact = require('@repage/renderer-react/browser');
const React = require('react');

module.exports = react;

function react() {
    return {
        name: require('./package.json').name,
        repagePlugins: [
            RepageRendererReact,
        ],
        renderToDom2,
    };
}

function renderToDom2({pageConfig, initialProps}) {
    const container_id = 'react-root';

    const container = get_or_create_container(container_id);

    const react_element = React.createElement(pageConfig.view, initialProps);

    const do_hydrate = container.firstChild !== null;

    if( do_hydrate ) {
        ReactDOM.hydrate(react_element, container);
    } else {
        ReactDOM.render(react_element, container);
    }
}

function get_or_create_container(container_id) {
    let container = document.body.querySelector('#'+container_id);
    if( ! container ) {
        container = create_dom_element({dom_id: container_id});
    }
    return container;
}

function create_dom_element({dom_id}) {
    const el = document.createElement('div');
    el.id = dom_id;
    const firstChild = document.body.firstChild;
    if( ! firstChild ) {
        document.body.appendChild(el);
    } else {
        document.body.insertBefore(el, firstChild);
    }
    return el;
}
