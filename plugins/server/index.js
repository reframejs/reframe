module.exports = serverPlugin;

function serverPlugin() {
    return {
        name: require('./package.json').name,
        server: require.resolve('./startServer'),
    };
}
