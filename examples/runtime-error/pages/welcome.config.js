import React from 'react';

const WelcomePage = {
    route: '/',
    view: () => {
        throw new Error('Error at line 6');
        return <div>Welcome</div>;
    },
};

export default WelcomePage;
