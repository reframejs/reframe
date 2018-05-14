module.exports = {homeViewTemplate, homePageTemplate};

function homeViewTemplate() {
    let template =

`
import React from 'react';

const LandingView = () => (
    <div>
        <h3>Welcome to Reframe</h3>
    </div>
);

const LandingPage = {
    route: '/',
    view: LandingView,
    title: 'Welcome',
};

export default LandingPage;
