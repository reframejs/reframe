import React from 'react';

const WelcomePage = {
    route: '/',
    view: () => (
        <div>
            Welcome to Reframe. Now using Koa-server!
            <br/>
            Custom Koa route: <a href="/hello-from-koa">/hello-from-koa</a>
        </div>
    ),
    renderHtmlAtBuildTime: true,
    doNotRenderInBrowser: true,
};

export default WelcomePage;
