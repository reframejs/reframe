module.exports = vue;

function vue() {
    const renderToDom = require('./renderToDom');

    return {
        name: require('./package.json').name,
        renderToDom,
    };
}
