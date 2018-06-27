import React from 'react';

export default {
    // Add <title>Welcome<title>
    title: 'Welcome',

    // Add <meta name="description" content="A welcome page.">
    description: 'A welcome page.',

    // Add <script src="https://example.org/awesome-lib.js" type="text/javascript"></script>
    scripts: [
        'https://example.org/awesome-lib.js',
    ],

    // Add <link href="https://example.org/awesome-lib.css" rel="stylesheet">
    styles: [
        'https://example.org/awesome-lib.css',
    ],

    // ...
    // ...
    // Every `@brillout/index-html` option is available over the page config
    // ...
    // ...

    route: '/',
    view: () => <h1>Welcome</h1>,
    doNotRenderInBrowser: true,
};
