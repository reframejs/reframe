import React from 'react';

const HelloComponent = props => React.createElement('div', null, 'Hello with ES Modules and Rollup');

const HelloPage = {
    route: '/',
    view: HelloComponent,
    htmlIsStatic: true,
};

export default HelloPage;
