import React from 'react';

const HelloComponent = props => React.createElement('div', null, 'Hello with ES Modules and Rollup');

console.log(HelloComponent);

const HelloPage = {
    route: '/',
    view: HelloComponent,
    htmlIsStatic: true,
};

export default HelloPage;
