process.on('unhandledRejection', err => {throw err});

const Hapi = require('hapi');
const {getReframeHapiPlugins} = require('@reframe/server');

const webpackBrowserConfig = {
    entry: [
        'babel-polyfill',
        '../pages/CounterPage.entry.js',
    ],
    output: {
        publicPath: '/',
        path: __dirname+'/dist/browser',
    },
    module: {
        rules: [
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
        ],
    },
};

const webpackServerConfig = {
    entry: '../pages/CounterPage.html.js',
    target: 'node',
    output: {
        publicPath: '/',
        path: __dirname+'/dist/server',
        libraryTarget: 'commonjs2'
    },
    module: webpackBrowserConfig.module,
};

(async () => {
    const server = Hapi.Server({port: 3000});

    const {HapiServerRendering, HapiServeBrowserAssets} = (
        await getReframeHapiPlugins({
            webpackBrowserConfig,
            webpackServerConfig,
            log: true,
        })
    );

    await server.register([
        {plugin: HapiServeBrowserAssets},
        {plugin: HapiServerRendering},
    ]);

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
})();

