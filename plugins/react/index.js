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
        webpackNodejsConfig: webpackMod,
    };

    function webpackMod({config, setRule, getRule, addBabelPreset}) {
        addBabelPreset(config, babelPresetReactPath);

        addJsxSupport({config, setRule, getRule});

        return config;
    }

    function addJsxSupport({config, getRule, setRule}) {
        const jsRule = getRule(config, '.js');
        const jsxRule = {...jsRule, test: /\.jsx$/};
        setRule(config, '.jsx', jsxRule);

        config.resolve = config.resolve || {};
        config.resolve.extensions = ['.jsx', '.js', '.json'];
    }
}
