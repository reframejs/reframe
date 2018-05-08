import React from 'react';

const HelloPage = {
    route: '/hello/{name}',
    view: props => {
      const name = props.route.args.name;
      return <div>Hello {name}</div>;
    },
};

export default HelloPage;
