const React = require('react');
const {BrowserRouter} = require('react-router');

function react_router_browser() {
    return {
        name: '@reframe/react-router',
        pageMixin: {
            viewWrapper: viewElement => {
                return React.createElement(BrowserRouter, null, viewElement);
            }
        },
    };
}
