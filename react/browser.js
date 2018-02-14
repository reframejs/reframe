const RepageRendererReact = require('@repage/renderer-react/browser');

module.exports = react;

function react() {
    return {
        name: require('./package.json').name,
        repagePlugins: [
            RepageRendererReact,
        ],
    };
}

