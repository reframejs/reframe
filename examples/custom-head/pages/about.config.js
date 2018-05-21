import React from 'react';

export default {
    route: '/about',
    domStatic: true,
    view: () => <h1>About Page</h1>,

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
};
