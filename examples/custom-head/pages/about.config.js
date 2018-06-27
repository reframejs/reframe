import React from 'react';

export default {
    // Set a different outer-part HTML for the `/about` page
    indexHtml: (
`<!DOCTYPE html>
<html>
    <head>
        <title>About</title>
        !HEAD
    </head>
    <body>
        !BODY
    </body>
</html>
`
    ),

    route: '/about',
    view: () => <h1>About Page</h1>,
    doNotRenderInBrowser: true,
};
