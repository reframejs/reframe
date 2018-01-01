process.on('unhandledRejection', err => {throw err});

const {createServer} = require('@reframe/core/server');
const path = require('path');

const webpackServerConfig = {
    entry: {
        "CounterPage.html": [
            "/home/romu/code/@reframe/example/pages/CounterPage.html.js"
        ],
    },
    "output": {
        "publicPath": "/",
        "path": "/home/romu/code/@reframe/example/dist",
        "filename": "[name].hash_[chunkhash].js",
        "chunkFilename": "[name].hash_[chunkhash].js",
        "libraryTarget": "commonjs2"
    },
    "context": "/home/romu/code/@reframe/core/build",
    module: {
        rules: [
            {
                "use": {
                    "loader": "/home/romu/code/@rebuild/node_modules/babel-loader/lib/index.js",
                    "options": {
                        "presets": [
                            [
                                "/home/romu/code/@rebuild/node_modules/babel-preset-env/lib/index.js",
                                {
                                    "modules": false,
                                    "useBuiltIns": "usage",
                                    "targets": {
                                        "node": "8.9.0"
                                    }
                                }
                            ],
                            "/home/romu/code/@rebuild/node_modules/babel-preset-react/lib/index.js",
                            [
                                "/home/romu/code/@rebuild/node_modules/babel-preset-env/lib/index.js",
                                {
                                    "modules": false,
                                    "useBuiltIns": "usage",
                                    "targets": {
                                        "node": "8.9.0"
                                    }
                                }
                            ],
                            "/home/romu/code/@rebuild/node_modules/babel-preset-react/lib/index.js"
                                ],
                                "plugins": [
                                    "/home/romu/code/@rebuild/node_modules/babel-plugin-transform-object-rest-spread/lib/index.js",
                                    "/home/romu/code/@rebuild/node_modules/babel-plugin-transform-strict-mode/lib/index.js",
                                    "/home/romu/code/@rebuild/node_modules/babel-plugin-dynamic-import-node/lib/index.js",
                                    "/home/romu/code/@rebuild/node_modules/babel-plugin-transform-object-rest-spread/lib/index.js",
                                    "/home/romu/code/@rebuild/node_modules/babel-plugin-transform-strict-mode/lib/index.js",
                                    "/home/romu/code/@rebuild/node_modules/babel-plugin-dynamic-import-node/lib/index.js"
                                ]
                    }
                },
                "exclude": [
                    "[RegExp: /node_modules/]",
                    "[RegExp: /node_modules/]"
                ],
                "test": /.js$/,
            }
        ],
    },
    "devtool": "source-map",
    "target": "node",
};

const webpackBrowserConfig = {
};

(async () => {
    const server = await createServer({
        pagesDir: path.join(__dirname, '../pages'),
        webpackServerConfig,
        log: true,
    });

    // todo add api example route
    //server.route

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
})();
