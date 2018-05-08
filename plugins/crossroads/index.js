module.exports = crossroads;

function crossroads() {
    const router = require('./router');

    return {
        name: require('./package.json').name,
        browserConfigFile: require.resolve('./browser.js'),
        router,
    };
}
