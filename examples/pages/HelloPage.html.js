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
  // Page's React component
  view: HelloComponent,

  // Page's URL.
  // Reframe follows the same route string syntax than React Router.
  // To use React Router's components `<Route>`, `<Switch>`, etc. add the plugin `@reframe/react-router`.
  route: '/hello/:name',

  // Page's <title>
  title: 'Hi there',
};

export default HelloPage;
