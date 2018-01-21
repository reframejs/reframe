const rules = [
    {
        test: /.js$/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    'babel-preset-react',
                    'babel-preset-env',
                ].map(require.resolve),
            }
        },
        exclude: [/node_modules/],
    }
];

const getWebpackBrowserConfig = () => ({
    entry: [
        'babel-polyfill',
        '../../../pages/CounterPage.entry.js',
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    module: {rules},
});

const getWebpackServerConfig = () => ({
    entry: '../../../pages/CounterPage.html.js',
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/server',
        libraryTarget: 'commonjs2'
    },
    module: {rules},
});

module.exports = {getWebpackBrowserConfig, getWebpackServerConfig};
