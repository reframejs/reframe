import React from 'react';

const WelcomePage = {
    route: '/',
    view: () => (
        <div>
            Route defined with Hapi: <a href="/hello-from-hapi">/hello-from-hapi</a>
        </div>
    ),
};

export default WelcomePage;
