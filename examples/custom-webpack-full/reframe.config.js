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
                plugins: [
                    'babel-plugin-transform-object-rest-spread'
                ].map(require.resolve),
            }
        },
        exclude: [/node_modules/],
    }
];

const webpackBrowserConfig = () => ({
    entry: [
        'babel-polyfill',
        '../../../basics/pages/CounterPage.entry.js',
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    module: {rules},
});

const webpackServerConfig = () => ({
    entry: '../../../basics/pages/CounterPage.js',
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/server',
        libraryTarget: 'commonjs2'
    },
    module: {rules},
});

module.exports = {webpackBrowserConfig, webpackServerConfig};
