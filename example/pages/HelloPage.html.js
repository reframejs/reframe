import React from 'react';

const HelloComponent = (
    props => {
        // Our route argument `name` is available at `props.route.args.name`
        const name = props.route.args.name;
        return (
            <div>Hello {name}</div>
        );
    }
);

const HelloPage = {
    // Page's root React component
    view: HelloComponent,

    // Page's URL.
    // The route string follows the same syntax than React Router.
    // (This route is analogous to `<Route path="/hello/:name" component={HelloComponent}/>`)
    // Add the plugin `@reframe/react-router` to use React Router's components `<Route>`, `<Switch>`, etc.
    route: '/hello/:name',

    // Page's <title>
    title: 'Hi there',
};

export default HelloPage;
