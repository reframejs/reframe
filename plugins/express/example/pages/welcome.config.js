import React from 'react';

const WelcomePage = {
    route: '/',
    view: () => (
        <div>
            Welcome to Reframe. Now using Express!
            <br/>
            Custom Express route: <a href="/hello-from-express">/hello-from-express</a>
        </div>
    ),
    renderHtmlAtBuildTime: true,
    doNotRenderInBrowser: true,
};

export default WelcomePage;
