const RepageRenderer = require('@repage/renderer/browser');
const RepageNavigator = require('@repage/navigator/browser');

module.exports = defaultKit;

function defaultKit() {
    return {
        name: require('./package.json').name,
        repagePlugins: [
            RepageRenderer,
            RepageNavigator,
        ],
    };
}

