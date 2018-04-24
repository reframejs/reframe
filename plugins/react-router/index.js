const React = require('react');
const {StaticRouter} = require('react-router');

module.exports = react_router;

function react_router() {
    return {
        name: require('./package.json').name,
        browserConfigFile: {
            diskPath: require.resolve('./browser.js'),
        },
        pageMixin: {
            viewWrapper: (viewElement, {route}) => {
                const loc = {
                    pathname: route.url.pathname,
                    search: route.url.search,
                    hash: route.url.hash,
                    state: undefined
                };
                const context = {};
                return React.createElement(StaticRouter, {location: loc, context}, viewElement);
            }
        },
    };
}
