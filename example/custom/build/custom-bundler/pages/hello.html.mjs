import React from 'react';

const HelloComponent = ({route: {args: {name}}}) => React.createElement('div', null, 'Hi '+name);

const HelloPage = {
    route: '/hello/{name}',
    view: HelloComponent,
};

export default HelloPage;
