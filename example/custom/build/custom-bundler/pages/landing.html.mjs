import React from 'react';

const LandingComponent = props => React.createElement('div', null, 'Hello with ES Modules and Rollup');

const LandingPage = {
    route: '/',
    view: LandingComponent,
    htmlIsStatic: true,
};

export default LandingPage;
