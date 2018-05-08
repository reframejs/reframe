const reactPlugin = require('@reframe/react');
const pathToRegexpPlugin = require('@reframe/path-to-regexp');
const serverPlugin = require('@reframe/server');
const buildPlugin = require('@reframe/build');
const browserPlugin = require('@reframe/browser');
const startCommands = require('@reframe/start');
const ejectCommands = require('@reframe/eject');

module.exports = reactKit;

function reactKit() {
    return {
        name: require('./package.json').name,
        plugins: [
            reactPlugin(),
            pathToRegexpPlugin(),
            serverPlugin(),
            buildPlugin(),
            browserPlugin(),
            startCommands(),
            ejectCommands(),
        ],
    };
}
