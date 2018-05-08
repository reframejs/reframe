module.exports = reactNativeWeb;

function reactNativeWeb() {
    const renderToDom = require('./renderToDom');

    return {
        name: require('./package.json').name,
        renderToDom,
    };
}
