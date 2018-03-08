const assert = require('reassert');
const assert_usage = assert;
const {add_extract_text_plugin} = require('@rebuild/config/CssConfig');
module.exports = postcss;

function postcss({loaderOptions}={}) {
    return {
        name: require('./package.json').name,
        // We modify only the browser config and not the server config, since the server doesn't load any CSS
        webpackBrowserConfig: ({config}) => {
            add_postcss_rule(config, loaderOptions);
            return config;
        },
    };
}

function add_postcss_rule(config, options={}) {
    const cssRuleIndex = (
        config.module.rules
        .findIndex(rule => {
        if( ! rule.test ) {
                return false;
            }
            const {test: testRegExp} = rule;
            assert_usage(testRegExp && testRegExp.test, rule);
            return testRegExp.test('dummy.css');
        })
    );

    assert_usage(
        cssRuleIndex>=0,
        "Can't find CSS rule"
    );

    const {extract_plugin, extract_loader} = (
        add_extract_text_plugin({
            config,
            loaders: [
                require.resolve('css-loader'),
                {
                    loader: require.resolve('postcss-loader'),
                    options,
                }
            ],
        })
    );

    config.plugins.push(extract_plugin);

    config.module.rules[cssRuleIndex] = {
        test: /\.css$/,
        use: extract_loader,
    };
}
