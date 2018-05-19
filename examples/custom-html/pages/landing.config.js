import React from 'react';

export default {
    route: '/',
    domStatic: true,
    view: () => <h1>Welcome</h1>,

    // All options are passed down to `@brillout/index-html`
    scripts: [
        {src: 'https://example.org/third-party-lib.js'}
    ],
};

