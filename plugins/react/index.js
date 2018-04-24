module.exports = react;

function react() {
    const RepageRendererReact = require('@repage/renderer-react');
    const babelPresetReactPath = require.resolve('babel-preset-react');

    return {
        name: require('./package.json').name,
        browserConfigFile: {
            diskPath: require.resolve('./browser.js'),
        },
        repagePlugins: [
            RepageRendererReact,
        ],
        webpackBrowserConfig: webpackMod,
        webpackServerConfig: webpackMod,
    };

    function webpackMod({config, setRule, getRule, addBabelPreset}) {
        addJsxSupport({config, setRule, getRule, addBabelPreset});
        return config;
    }

    function addJsxSupport({config, addBabelPreset, getRule, setRule}) {
        addBabelPreset(config, babelPresetReactPath);

        const jsRule = getRule(config, 'js');
        const jsxRule = {...jsRule, test: /\.jsx$/};
        setRule(config, 'jsx', jsxRule);

        config.resolve = config.resolve || {};
        config.resolve.extensions = ['.jsx', '.js', '.json'];
    }
}
