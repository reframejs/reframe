const RepageRouterCrossroads = require('@repage/router-crossroads/browser');

module.exports = crossroads;

function crossroads() {
    return {
        name: require('./package.json').name,
        repagePlugins: [
            RepageRouterCrossroads,
        ],
    };
}

