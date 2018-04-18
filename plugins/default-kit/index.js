const reactPlugin = require('@reframe/react');
//const crossroadsPlugin = require('@reframe/crossroads');
const pathToRegexp = require('@reframe/path-to-regexp');
const RepageRenderer = require('@repage/renderer');
const buildPlugin = require('@reframe/build');
const serverPlugin = require('@reframe/server');
const browserPlugin = require('@reframe/browser');

module.exports = defaultKit;

function defaultKit() {
    return {
        name: require('./package.json').name,
        reframeBrowserConfig: {
            diskPath: require.resolve('./browser.js'),
        },
        plugins: [
            reactPlugin(),
         // crossroadsPlugin(),
            pathToRegexp(),
            buildPlugin(),
            serverPlugin(),
            browserPlugin(),
        ],
        repagePlugins: [
            RepageRenderer,
        ],
    };
}
