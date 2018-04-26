const RepageRouterPathToRegexp = require('@repage/router-path-to-regexp');

module.exports = pathToRegexpPlugin;

function pathToRegexpPlugin() {
    return {
        name: require('./package.json').name,
        browserConfigFile: {
            diskPath: require.resolve('./browser.js'),
        },
        repagePlugins: [
            RepageRouterPathToRegexp,
        ],
    };
}
