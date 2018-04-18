module.exports = browserPlugin;

function browserPlugin() {
    return {
        name: require('./package.json').name,
        browserEntryFile: require.resolve('./browserEntry'),
    };
}
