import React from 'react';
import './landing.css';

const LandingComponent = () => (
    <div>
        <div className="blue-on-red">
            Blue on red.
        </div>
        <div className="red-on-blue">
            Red on blue.
        </div>
    </div>
);

const LandingPage = {
    route: '/',
    view: LandingComponent,
};

export default LandingPage;
