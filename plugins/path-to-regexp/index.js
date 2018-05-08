module.exports = pathToRegexpPlugin;

function pathToRegexpPlugin() {
    const router = require('./router');

    return {
        name: require('./package.json').name,
        browserConfigFile: {
            diskPath: require.resolve('./browser.js'),
        },
        router,
    };
}
