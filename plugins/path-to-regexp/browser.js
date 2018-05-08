//const RepageRouterPathToRegexp = require('@repage/router-path-to-regexp/browser');

const router = require('./router');

module.exports = pathToRegexp;

function pathToRegexp() {
    return {
        name: require('./package.json').name,
        router2: router,
        /*
        repagePlugins: [
            RepageRouterPathToRegexp,
        ],
        */
    };
}

