const React = require('react');

module.exports = {
    CONTAINER_ID: 'root-react-native',
    getReactComponent,
};

function getReactComponent({pageConfig, initialProps, viewWrappers}) {
    let App = pageConfig.view;

    App = applyViewWrappers({App, initialProps, viewWrappers});

    return App;
}

function applyViewWrappers({reactElement, initialProps, viewWrappers=[]}) {
    viewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });
    return reactElement;
}


// Apply view wrappers.
// E.g. the `@reframe/react-router` plugin adds a view wrapper to add
// the provider-components `<BrowserRouter>` and `<StaticRouter>`.
function applyViewWrappers({App, initialProps, viewWrappers=[]}) {
    viewWrappers
    .forEach(viewWrapper => {
        const wrappee = App;
        App = () => viewWrapper(React.createElement(wrappee, initialProps), initialProps);
    });

    return App;
}
