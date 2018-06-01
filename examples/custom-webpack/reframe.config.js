module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ],
    webpackBrowserConfig,
};

function webpackBrowserConfig({config, setRule}) {
    const rule = {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        require('postcss-cssnext')(),
                    ],
                    parser: 'sugarss'
                }
            }
        ]
    };

    setRule(config, '.css', rule);

    return config;
}
