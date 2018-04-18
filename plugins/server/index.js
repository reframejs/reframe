module.exports = serverPlugin;

function serverPlugin() {
    return {
        name: require('./package.json').name,
        serverEntryFile: require.resolve('./startServer'),
    };
}
