const babelPresetReactPath = require.resolve('@babel/preset-react');

module.exports = webpackNodejsConfig;

function webpackNodejsConfig({config, setRule, getRule, addBabelPreset, addExtension}) {
    addBabelPreset(config, babelPresetReactPath);

    addJsxExtension({config, setRule, getRule, addExtension});

    return config;
}

function addJsxExtension({config, getRule, setRule, addExtension}) {
    const jsRule = getRule(config, '.js');

    if( ! jsRule ) {
        return;
    }

    const jsxRule = {...jsRule};
    delete jsxRule.test;
    setRule(config, '.jsx', jsxRule);

    addExtension(config, '.jsx');
}
