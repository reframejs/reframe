const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const assert_usage = require('reassert/usage');
const find_up = require('find-up');
const getUserDir = require('@brillout/get-user-dir');
const reconfig = require('@brillout/reconfig');
const {transparentGetter} = require('@brillout/reconfig/getters');

const $name = require('./package.json').name;
const $getters = [
    transparentGetter('typescript')
];

module.exports = {
    $name,
    $getters,
    webpackBrowserConfig: webpackMod,
    webpackNodejsConfig: webpackMod,
    transpileServerCode: true,
};

function webpackMod({config, getRule, setRule, addExtension}) {
    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});
    const {loaderOptions={transpileOnly: true}, dontUseForkChecker=false, forkCheckerOptions={silent: true}} = reframeConfig.typescript || {};

    add_typescript({config, getRule, setRule, addExtension, loaderOptions, dontUseForkChecker, forkCheckerOptions});

    return config;
}
function add_typescript({config, getRule, setRule, addExtension, loaderOptions, dontUseForkChecker, forkCheckerOptions}) {
    const jsRule = getRule(config, '.js');

    assert_usage([Object, Array].includes(jsRule.use && jsRule.use.constructor), jsRule);
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

    const tsRule = {
        use: [
            ...jsLoaders,
            {
                loader: require.resolve('ts-loader'),
                options: loaderOptions,
            }
        ]
    };
    setRule(config, '.ts', tsRule);
    setRule(config, '.tsx', tsRule);

    addExtension(config, '.ts');
    addExtension(config, '.tsx');

    if( ! dontUseForkChecker ) {
        config.plugins = config.plugins || [];
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
