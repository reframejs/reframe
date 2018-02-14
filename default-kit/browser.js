const reactPlugin = require('@reframe/react/browser');
//const crossroadsPlugin = require('@reframe/crossroads/browser');
const pathToRegexp = require('@reframe/path-to-regexp/browser');
const RepageRenderer = require('@repage/renderer/browser');
const RepageNavigator = require('@repage/navigator/browser');

module.exports = defaultKit;

function defaultKit() {
    return {
        name: require('./package.json').name,
        plugins: [
            reactPlugin(),
         // crossroadsPlugin(),
            pathToRegexp(),
        ],
        repagePlugins: [
            RepageRenderer,
            RepageNavigator,
        ],
    };
}

