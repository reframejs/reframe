const babelPresetReactPath = require.resolve('babel-preset-react');

module.exports = webpackNodejsConfig;

function webpackNodejsConfig({config, setRule, getRule, addBabelPreset}) {
    addBabelPreset(config, babelPresetReactPath);

    addJsxSupport({config, setRule, getRule});

    return config;
}

function addJsxSupport({config, getRule, setRule}) {
    const jsRule = getRule(config, '.js');

    if( ! jsRule ) {
        return;
    }

    const jsxRule = {...jsRule, test: /\.jsx$/};
    setRule(config, '.jsx', jsxRule);

    config.resolve = config.resolve || {};
    config.resolve.extensions = ['.jsx', '.js', '.json'];
}
