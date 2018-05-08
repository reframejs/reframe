module.exports = react;

function react() {
    const renderToDom = require('./renderToDom');

    return {
        name: require('./package.json').name,
        renderToDom,
    };
}
