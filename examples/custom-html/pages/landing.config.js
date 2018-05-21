import React from 'react';

export default {
    route: '/',
    domStatic: true,
    view: () => <h1>Welcome</h1>,

    // All page config options are passed down to `@brillout/index-html`
    scripts: [
        'https://example.org/awesome-lib.js',
    ],
    styles: [
        'https://example.org/awesome-lib.css',
    ],
};

