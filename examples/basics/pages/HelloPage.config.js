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
  route: '/hello/:name', // Parameterized route
  view: HelloComponent,
  title: 'Hi there',
};

export default HelloPage;
