const assert = require('reassert');
const assert_usage = assert;
const {getExtractTextPlugin} = require('@rebuild/config/CssConfig');
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

    const {extractPlugin, extractLoader} = getExtractTextPlugin({config});

    if( ! config.plugins.includes(extractPlugin) ) {
        config.plugins.push(extractPlugin);
    }

    config.module.rules[cssRuleIndex] = {
        test: /\.css$/,
        use: [
            extractLoader,
            require.resolve('css-loader'),
            {
                loader: require.resolve('postcss-loader'),
                options,
            },
        ],
    };
}
