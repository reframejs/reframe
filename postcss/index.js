module.exports = postcss;

function postcss({loaderOptions}={}) {
    return {
        name: require('./package.json').name,
        // We modify only the browser config and not the server config, since the server doesn't load any CSS
        webpackBrowserConfig: ({config}) => {
            add_postcss_rule(config, loaderOptions);
            return config;
        },
        /*
        pageMixin: {
            scripts: [
                {
                    src: 'https://example.org/neat-script.js',
                    async: true,
                },
            ],
        },
        */
    };
}

function add_postcss_rule(config, options={}) {
    const cssRule = {
        test: /\.css$/,
        use: [
            require.resolve('style-loader'),
            require.resolve('css-loader'),
            {
                loader: require.resolve('postcss-loader'),
                options,
            }
        ]
    };

    const cssRuleIndex = (
        config.module.rules
        .findIndex(({test: testRegExp}) => testRegExp.test('dummy.css'))
    );

    config.module.rules[cssRuleIndex] = cssRule;
}
