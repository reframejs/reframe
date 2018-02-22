const RepageRouterPathToRegexp = require('@repage/router-path-to-regexp/browser');

module.exports = pathToRegexp;

function pathToRegexp() {
    return {
        name: require('./package.json').name,
        repagePlugins: [
            RepageRouterPathToRegexp,
        ],
    };
}

