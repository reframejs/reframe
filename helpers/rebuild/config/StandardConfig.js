const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');
const assert_todo = assert_internal;
const pathModule = require('path');
const webpack = require('webpack');
const get_caller = require('parent-module');
const CssConfig = require('./CssConfig');

module.exports = {StandardConfig, StandardNodeConfig};

function BaseConfig({
    entry: entry_points,
    context,
    outputPath,
    is_node_target,
    filename,
}) {
    return [
        config_entry({entry_points}),
        config_output({outputPath, is_node_target, filename}),
        config_resolve({context}),
        config_base(),
     // config_always_write,
        config_source_map,
        config_es_latest({is_node_target}),
        //*
        config_file_fallback_loader({is_node_target}),
        /*/
        config_static_files({is_node_target}),
        //*/
      //config_json,
        config_mode,
    ];
}

function parent_module() {
    return get_caller(__filename);
}

function StandardConfig(args) {
    return [
        ...BaseConfig.call(null, {is_node_target: false, ...args}),
        //*
        CssConfig(),
        /*/
        config_ignore_css,
        //*/
        config_code_splitting,
    ];
}

function StandardNodeConfig(args) {
    return [
        ...BaseConfig.call(null, {is_node_target: true, ...args}),
        config_target({libraryTarget: 'commonjs2'}),
        config_ignore_css,
        config_ignore_node_modules,
    ];
}

function config_target({libraryTarget}) {
    assert_usage(libraryTarget);
    return () => ({
        target: 'node',
        node: {
          __dirname: true,
          __filename: true,
        },
        output: {
            libraryTarget,
        },
    });
}

function config_code_splitting() {
    /*
    if( ! is_production() ) {
        return {};
    }
    */
    //*
    return {
        optimization: {
            splitChunks: {
                chunks: "all",
                name: true,
                maxInitialRequests: 5,
            },
        },
    };
    /*/
    return {
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                names: 'commons',
            })
        ],
    };
    //*/
}

//*
function config_source_map() {
    /*
    if( ! is_production() ) {
        return;
    }
    */
    return {
        devtool: 'source-map',
     // devtool: 'eval-source-map',
     // devtool: 'inline-source-map',
     // devtool: 'cheap-module-inline-source-map',
    };
}
//*/

function config_entry({entry_points}) {
    assert_usage(entry_points);

    let bundles;
    if( entry_points.constructor === Object ) {
        bundles = entry_points;
    } else {
        assert_usage([String, Array].includes(entry_points.constructor), entry_points);
        bundles = {
            main: entry_points,
        };
    }
    for(const bundle_name in bundles) {
        const bundle = bundles[bundle_name];
        assert_usage(bundle && [String, Array].includes(bundle.constructor), bundles, bundle, bundle_name);
        if( bundle.constructor === String ) {
            bundles[bundle_name] = [bundle];
        }
    }
    validate({bundles});

    return () => ({
        entry: {
            ...bundles,
            _transformer: bundles => {
                if( bundles['*'] ) {
                 // assert_usage(bundles['*'].includes('MERGE_POINT'));
                    Object.entries(bundles)
                    .forEach(([bundle_name, bundle]) => {
                        if( bundle_name !== '*' ) {
                            bundle.unshift(...bundles['*']);
                        }
                    });
                }
                delete bundles['*'];
                return bundles;
            },
        },
    });

    function validate({bundles}) {
        assert_internal(bundles.constructor===Object);
        Object.values(bundles)
        .forEach(entries => {
            assert_internal(entries.constructor===Array);
            entries.forEach(entry_point => {
                assert_internal(entry_point.constructor===String, bundles, entry_points);
            });
        });
    }
}

function config_output({outputPath, is_node_target, filename}) {
    assert_usage(outputPath);
    assert_usage(pathModule.isAbsolute(outputPath));

    filename = filename || is_node_target && '[name].js' || '[name].hash_[chunkhash].js';

    return () => ({
        output: {
            publicPath: '/',
            path: outputPath,
            filename,
            chunkFilename: filename,
        },
    });
}

function config_base() {
    return () => ({
        /*
        plugins: {
         // _transformer: () => {},
        },
        */
        module: {rules: {
            _transformer: rules => {
                return (
                    [
                        ...(
                            Object.entries(rules)
                            .filter(([key]) => key!=='*')
                            .map(([key, rule_object]) => {
                             // rule_object.test = filename => filename.endsWith('.'+key);
                                rule_object.test = new RegExp('\\.'+key+'$');
                                return rule_object;
                            })
                        ),
                        ...(
                            Object.entries(rules)
                            .filter(([key]) => key==='*')
                            .map(([_, rule_object]) => rule_object)
                        ),
                    ]
                );
            },
        }},
    });
}

/*
function config_index_html() {
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    return {
        plugins.html_webpack_plugin: new HtmlWebpackPlugin(),
    };
}
*/

function config_resolve({context}) {
    return () => {
        let config_part = {
            /*
            resolveLoader: {modules: [
             // __dirname+'/',
                pathModule.join(__dirname, "../node_modules"),
            ]},
            */
            context,
        };
        const extra_paths = (process.env['NODE_PATH']||'').split(':').filter(Boolean);
        if( extra_paths.length > 0 ) {
            config_part = {
                ...config_part,
                resolve: {modules: [
                    "node_modules",
                    ...extra_paths,
                ]},
            };
        }
        return config_part;
    };
}

/*
function config_always_write() {
    const WriteFilePlugin = require('write-file-webpack-plugin');
    const write_file_plugin = new WriteFilePlugin();
    return {
        plugins: [
            write_file_plugin,
        ],
    };
}
*/

function config_hmr() {
    return {
        hot_module_replacement_plugin: new webpack.HotModuleReplacementPlugin(),
    };
}

function config_ignore_css() {
    const rules = {
        css: {
            use: [
                require.resolve('ignore-loader'),
            ],
        }
    };
    return {module: {rules}};
}

function config_ignore_node_modules() {
    return {
        externals: [skip_node_modules],
    };

    function skip_node_modules(context, request, callback) {
     // console.log(request);
     // console.log(context);

        let filePath;
        try {
            filePath = require.resolve(request, {paths: [context]});
        } catch(err) {
            include();
            return;
        }

        if( filePath.split(pathModule.sep).includes('node_modules') ) {
            skip();
            return;
        }

        include();

        return;

        function skip() {
            callback(null, "commonjs " + request);
        }
        function include() {
            callback();
        }
    }
}

function config_json() {
    const rules = {
        json: {
            use: [
                require.resolve('json-loader'),
            ],
        },
    };
    return {module: {rules}};
}

function config_mode() {
    return {
        mode: is_production() ? 'production': 'development',
    };
}

function config_file_fallback_loader({is_node_target}={}) {
    return (
        config => {
            const rules = {};
            /*
            if( ! config.module.rules.json ) {
                rules.json = {
                    use: [
                        require.resolve('json-loader'),
                    ],
                };
            }
            */
            rules['*'] = {
                use: [
                    {
                        loader: require.resolve('./fallback-loader'),
                        options: {
                            fallback: require.resolve('file-loader'),
                            name: '[name].hash_[hash].[ext]',
                            emitFile: !is_node_target,
                        },
                    }
                ],
            };
            return {module: {rules}};
        }
    );
}

/*
function config_static_files({is_node_target}={}) {
    return config_fn;

    function config_fn(config) {
        const rules = {};
        get_static_file_types()
        .filter(({is_style}) => !is_style)
        .forEach(({ext}) => {
            rules[ext] = {
                use: [
                    {
                        loader: require.resolve('file-loader'),
                        options: {
                            name: '[name].hash_[hash].[ext]',
                            emitFile: !is_node_target,
                        },
                    }
                ],
            }
        });
        return {module: {rules}};
    }

    function get_static_file_types() {
        return [
            {ext: 'css', is_style: true},

            ...(
                [
                    'woff',
                    'woff2',
                    'eot',
                    'ttf',
                ]
                .map(ext => ({ext, is_font: true}))
            ),

            ...(
                [
                    'svg',
                    'gif',
                    'jpg',
                    'jpeg',
                    'png',
                    'ico',
                ]
                .map(ext => ({ext, is_image: true}))
            ),
        ];
    }
}
*/

function config_es_latest({is_node_target}) {
    assert_internal([true, false].includes(is_node_target));

    const babel_preset_env_opts = {
        modules: false,
        useBuiltIns: 'entry',
        corejs: 2,
        targets: (
            is_node_target && (
                {node: "8.9.0"}
            ) ||
            ! is_node_target && ! is_production() && (
                {browsers: [
                    "last 2 Chrome version",
                    "last 2 Firefox version",
                ]}
            ) ||
            undefined
        ),
    };

    const conf = {
        module: {rules: {
            js: {
                use: {
                    loader: require.resolve('babel-loader'),
                    options: {
                        presets: [
                            [require.resolve('@babel/preset-env'), babel_preset_env_opts]
                        ],
                        plugins: [
                            require.resolve("@babel/plugin-proposal-object-rest-spread"),
                            require.resolve("@babel/plugin-transform-strict-mode"),
                        ],
                    },
                },
                exclude: [
                    /node_modules/,
                ],
            },
        }},
    };
    if( ! is_node_target && is_production() ) {
        conf.entry = {
            '*': [
                require.resolve('@babel/polyfill'),
            ],
            /*
            main: [
                require.resolve('@babel/polyfill'),
            ],
            */
        };
    }
    return () => conf;
}

function is_production() {
   return process.env.NODE_ENV === 'production';
}

