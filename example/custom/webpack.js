process.on('unhandledRejection', err => {throw err});

const {createServer} = require('@reframe/server');
const path = require('path');

const js_rule = {
    test: /.js$/,
    use: {
     // loader: "/home/romu/code/@rebuild/node_modules/babel-loader/lib/index.js",
        loader: 'babel-loader',
        options: {
            presets: [
                'babel-preset-react',
                'babel-preset-env',
              //"/home/romu/code/@rebuild/node_modules/babel-preset-react/lib/index.js",
              //"/home/romu/code/@rebuild/node_modules/babel-preset-env/lib/index.js",
            ].map(require.resolve),
            plugins: [
                "/home/romu/code/@rebuild/node_modules/babel-plugin-transform-object-rest-spread/lib/index.js",
            ],
        }
    },
    exclude: [
        /node_modules/,
    ],
};

const webpackServerConfig = {
    entry: {
        'CounterPage': [
            require.resolve('../pages/CounterPage.html.js'),
        ],
    },
    output: {
        publicPath: '/',
        path: __dirname+'/dist/server',
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    module: {
        rules: [
            js_rule,
        ],
    },
};

const webpackBrowserConfig = {
    entry: {
        'CounterPage.entry': [
            require.resolve('../pages/CounterPage.entry.js'),
        ],
    },
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    context: __dirname,
    devServer: {
        port: 8082,
    },
    module: {
        rules: [
            js_rule,
        ],
    },
};

(async () => {
    const server = await createServer({
        pagesDir: path.join(__dirname, '../pages'),
        webpackBrowserConfig,
        webpackServerConfig,
        log: true,
    });

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
})();
