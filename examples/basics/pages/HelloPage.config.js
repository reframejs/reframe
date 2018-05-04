import React from 'react';

const HelloPage = {
  route: '/hello/:name', // Parameterized route
  title: 'Hi there', // Page's <title>
  view: props => {
    // Our route argument `name` is available at `props.route.args.name`
    const name = props.route.args.name;
    return (
      <div>Hello {name}</div>
    );
  }
};

export default HelloPage;
