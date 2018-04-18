module.exports = serverPlugin;

function serverPlugin() {
    const packageName = require('./package.json').name;
    return {
        name: packageName,
        server: packageName+'/startServer',
    };
}
