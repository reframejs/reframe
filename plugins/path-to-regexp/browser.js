module.exports = pathToRegexp;

function pathToRegexp() {
    const router = require('./router');

    return {
        name: require('./package.json').name,
        router,
    };
}

