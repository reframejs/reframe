const assert_internal = require('reassert/internal');

module.exports = ReactConfig;

function ReactConfig() {
    return config_react;
}

function config_react(config) {
    const js_rule = config.module.rules.js;
    assert_internal(js_rule, config);
    assert_internal(js_rule.use.loader.includes('@babel/loader'), config);
    assert_internal(js_rule.use.options, config);
    assert_internal(js_rule.use.options.presets, config);

    js_rule.use.options.presets.push(require.resolve('@babel/preset-react'));

    return {
        resolve: {
            extensions: ['.jsx', '.js', '.json', ],
        },
        module: {rules: {
            js: js_rule,
            jsx: js_rule,
        }},
    };
}
