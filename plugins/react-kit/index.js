const reactPlugin = require('@reframe/react');
const pathToRegexpPlugin = require('@reframe/path-to-regexp');
const RepageRenderer = require('@repage/renderer');
const serverPlugin = require('@reframe/server');
const buildPlugin = require('@reframe/build');
const browserPlugin = require('@reframe/browser');
const startCommands = require('@reframe/start');
const ejectCommands = require('@reframe/eject');

module.exports = reactKit;

function reactKit() {
    return {
        name: require('./package.json').name,
        browserConfigFile: {
            diskPath: require.resolve('./browser.js'),
        },
        plugins: [
            reactPlugin(),
            pathToRegexpPlugin(),
            serverPlugin(),
            buildPlugin(),
            browserPlugin(),
            startCommands(),
            ejectCommands(),
        ],
        repagePlugins: [
            RepageRenderer,
        ],
    };
}
