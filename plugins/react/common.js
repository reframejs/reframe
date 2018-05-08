const React = require('react');

const containerId = 'root-react';

module.exports = {getReactElement, containerId};

function getReactElement({pageConfig, initialProps}) {
    const reactElement = React.createElement(pageConfig.view, initialProps);

}
