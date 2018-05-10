const babelPresetReactPath = require.resolve('babel-preset-react');

module.exports = webpackNodejsConfig;

function webpackNodejsConfig({config, setRule, getRule, addBabelPreset}) {
    addBabelPreset(config, babelPresetReactPath);

    addJsxExtension({config, setRule, getRule});

    return config;
}

function addJsxExtension({config, getRule, setRule}) {
    const jsRule = getRule(config, '.js');

    if( ! jsRule ) {
        return;
    }

    const jsxRule = {...jsRule};
    delete jsxRule.test;
    setRule(config, '.jsx', jsxRule);

    config.resolve = config.resolve || {};
    config.resolve.extensions = ['.jsx', '.js', '.json'];
}
