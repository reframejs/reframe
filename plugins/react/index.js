const RepageRendererReact = require('@repage/renderer-react');

module.exports = react;

function react() {
    return {
        name: require('./package.json').name,
        reframeBrowserConfig: {
            diskPath: require.resolve('./browser.js'),
        },
        repagePlugins: [
            RepageRendererReact,
        ],
    };
}
