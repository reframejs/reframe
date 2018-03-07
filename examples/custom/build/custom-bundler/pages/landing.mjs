import React from 'react';

const LandingComponent = (
    props => (
        React.createElement('div', null,
            'Hello with ES Modules and Rollup.',
            React.createElement('br'),
            React.createElement('br'),
            'This page is HTML-static and DOM-static.',
            React.createElement('br'),
            React.createElement('br'),
            'A HTML-dynamic and DOM-dynamic page: ',
            React.createElement('a', {href: '/hello/alice'}, '/hello/alice')
        )
    )
);

const LandingPage = {
    route: '/',
    view: LandingComponent,
    htmlIsStatic: true,
};

export default LandingPage;
