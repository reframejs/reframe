import React from 'react';

const WelcomePage = {
    route: '/',
    view: () => (
        <div>
            Welcome to Reframe.
            <br/><br/>
            <small>
                Built at {new Date().toString()}
            </small>
        </div>
    ),
    renderHtmlAtBuildTime: true,
    doNotRenderInBrowser: true,
};

export default WelcomePage;
