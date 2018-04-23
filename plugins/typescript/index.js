const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const find_up = require('find-up');
const getUserDir = require('@brillout/get-user-dir');

module.exports = ts;

function ts({loaderOptions={transpileOnly: true}, dontUseForkChecker=false, forkCheckerOptions={silent: true}}={}) {
    return {
        name: require('./package.json').name,
        webpackBrowserConfig: webpackMod,
        webpackServerConfig: webpackMod,
    };
    function webpackMod({config}) {
        add_typescript(config, {loaderOptions, dontUseForkChecker, forkCheckerOptions});
        return config;
    }
}

function add_typescript(config, {loaderOptions, dontUseForkChecker, forkCheckerOptions}) {
    const jsRule = (
        config.module.rules
        .find(({test: testRegExp}) => testRegExp.test('dummy.js'))
    );
    assert_internal([Object, Array].includes(jsRule.use && jsRule.use.constructor), jsRule);
    const jsLoaders = (
        jsRule.use.constructor===Array ? (
            jsRule.use
        ) : (
            [jsRule.use]
        )
    );

    const tsconfig_path = get_tsconfig_path(config, loaderOptions, forkCheckerOptions);
    forkCheckerOptions.tsconfig = tsconfig_path;
    loaderOptions.configFile = tsconfig_path;

    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            ...jsLoaders,
            {
                loader: require.resolve('ts-loader'),
                options: loaderOptions,
            }
        ]
    });

    if( ! dontUseForkChecker ) {
        config.plugins.push(new ForkTsCheckerWebpackPlugin(forkCheckerOptions));
    }
}

function get_tsconfig_path(config, loaderOptions, forkCheckerOptions) {
    if( loaderOptions.configFile ) {
        return loaderOptions.configFile;
    }
    if( forkCheckerOptions.tsconfig ) {
        return forkCheckerOptions.tsconfig;
    }
    const userDir = config.context || getUserDir();
    const algorithmDesc = 'The "user directory" is determined by the `context` option of the webpack config and if missing then by using `@brillout/get-user-dir`';
    assert_usage(
        userDir,
        'Cannot find `tsconfig.json` because couldn\'t find the "user directory".',
        algorithmDesc
    );
    const tsconfig_path = find_up.sync('tsconfig.json', {cwd: userDir});
    assert_usage(
        tsconfig_path,
        'Cannot find `tsconfig.json` by looking into every directory from the "user directory" '+userDir+' to the root `/`.',
        algorithmDesc
    );
    return tsconfig_path;
}
