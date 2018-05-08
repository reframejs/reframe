const React = require('react');
const assert_usage = require('reassert/usage');

const containerId = 'root-react';

module.exports = {getReactElement, containerId};

function getReactElement({pageConfig, initialProps}) {
    assert_usage(pageConfig.view);

    const reactElement = React.createElement(pageConfig.view, initialProps);

    assert_usage(React.isValidElement(reactElement));

    return reactElement;
}
