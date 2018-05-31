const React = require('react');

module.exports = {
    CONTAINER_ID: 'root-react',
    getReactElement,
};

function getReactElement({pageConfig, initialProps, viewWrappers}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);
    reactElement = applyViewWrappers({reactElement, initialProps, viewWrappers});
    return reactElement;
}

// Apply view wrappers.
// E.g. the `@reframe/react-router` plugin adds a view wrapper to add
// the provider-components `<BrowserRouter>` and `<StaticRouter>`.
function applyViewWrappers({reactElement, initialProps, viewWrappers=[]}) {
    viewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });
    return reactElement;
}
