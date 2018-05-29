const React = require('react');
const {BrowserRouter} = require('react-router-dom');

module.exports = browserViewWrapper;

function browserViewWrapper(viewElement) {
    return React.createElement(BrowserRouter, null, viewElement);
}

