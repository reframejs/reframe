const WebpackSSR = require('./index');
const path = require('path');

const ssrBuild = new WebpackSSR({
    outputDir: path.resolve(__filename, '../dist'),
});

ssrBuild.pages = [
    require.resolve('./landing-page.js'),
    require.resolve('./about-page.js'),
    /*
    {
        view: '<div>Welcome. This is a webpack-ssr example.</div>',
    },
    {
        view: '<div>Welcome. About page.</div>',
    },
    */
];

ssrBuild.browserEntry = require.resolve('browser.js');

//ssrBuild.serverEntry = require.resolve('server.js');

ssrBuild.build();
