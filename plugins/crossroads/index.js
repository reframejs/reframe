const RepageRouterCrossroads = require('@repage/router-crossroads');

module.exports = crossroads;

function crossroads() {
    return {
        name: require('./package.json').name,
        browserConfigFile: {
            diskPath: require.resolve('./browser.js'),
        },
        repagePlugins: [
            RepageRouterCrossroads,
        ],
    };
}
