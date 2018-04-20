const reactPlugin = require('@reframe/react');
//const crossroadsPlugin = require('@reframe/crossroads');
const pathToRegexp = require('@reframe/path-to-regexp');
const RepageRenderer = require('@repage/renderer');
const serverPlugin = require('@reframe/server');
const buildPlugin = require('@reframe/build');
const browserPlugin = require('@reframe/browser');
const startCommands = require('@reframe/start');
const ejectCommand = require('@reframe/eject');

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
            serverPlugin(),
            buildPlugin(),
            browserPlugin(),
            startCommands(),
            ejectCommand(),
        ],
        repagePlugins: [
            RepageRenderer,
        ],
    };
}
