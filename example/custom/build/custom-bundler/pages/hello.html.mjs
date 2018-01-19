import React from 'react';

const HelloComponent = props => React.createElement('div', 'Hello with ES Modules and Rollup');

console.log(HelloComponent);

const HelloPage = {
    title: 'Hi there', // page's title
    route: '/hello/{name}', // page's URL
    view: HelloComponent,
};

export default HelloPage;
