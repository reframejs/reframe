const React = require('react');
const {BrowserRouter} = require('react-router-dom');

module.exports = react_router_browser;

function react_router_browser() {
    return {
        name: require('./package.json').name,
        pageMixin: {
            viewWrapper: viewElement => {
                return React.createElement(BrowserRouter, null, viewElement);
            }
        },
    };
}
