import React from 'react';

const WelcomePage = {
    route: '/',
    view: () => (
        <div>
            Welcome to Reframe.
            <br/>
            <div>
                Built at {new Date().toString()}
            </div>
        </div>
    ),
    htmlStatic: true,
    domStatic: true,
};

export default WelcomePage;
