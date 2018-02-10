const assert = require('reassert');
const assert_internal = assert;
const assert_plugin = assert;

module.exports = {processReframeConfig};

function processReframeConfig(reframeConfig) {
    if( ! reframeConfig || reframeConfig._processed ) {
        return;
    }
    reframeConfig._processed = {};
    assert_internal(reframeConfig._processed, reframeConfig);
    add_webpack_config_modifiers(reframeConfig);
}

function add_webpack_config_modifiers(reframeConfig) {
    const modifiers = (
        ['Browser', 'Server']
        .map(configEnv => {
            let modifier = null;
            (reframeConfig.plugins||[])
            .forEach(plugin => {
                const modifier_name = 'webpack'+configEnv+'Config';
                if( plugin[modifier_name] ) {
                    assert_plugin(plugin[modifier_name] instanceof Function);
                    const previous_modifier = modifier || (({config}) => config);
                    modifier = args => plugin[modifier_name]({...args, config: previous_modifier(args)});
                }
            });
            assert_internal(modifier===null || modifier instanceof Function);
            return modifier;
        })
    );
    reframeConfig._processed.webpackBrowserConfigModifier = modifiers[0];
    reframeConfig._processed.webpackServerConfigModifier = modifiers[1];
}
