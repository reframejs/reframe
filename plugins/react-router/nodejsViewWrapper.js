const React = require('react');
const {StaticRouter} = require('react-router');

module.exports = nodejsViewWrapper;

function nodejsViewWrapper(viewElement, {route}) {
    const loc = {
        pathname: route.url.pathname,
        search: route.url.search,
        hash: route.url.hash,
        state: undefined
    };

    const context = {};

    return React.createElement(StaticRouter, {location: loc, context}, viewElement);
}
