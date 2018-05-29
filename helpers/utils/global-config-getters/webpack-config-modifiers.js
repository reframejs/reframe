const globalConfig = require('@brillout/global-config');
const assert_usage = require('reassert/usage');

globalConfig.$addGetter({
    prop: 'webpackBrowserConfigModifier',
    getter: configParts => assemble_modifiers('webpackBrowserConfig', configParts),
});
globalConfig.$addGetter({
    prop: 'webpackNodejsConfigModifier',
    getter: configParts => assemble_modifiers('webpackNodejsConfig', configParts),
});


// We assemble several webpack config modifiers into one supra modifier
function assemble_modifiers(modifier_name, configParts) {
    // `configParts` holds all globalConfig parts

    // `config` holds a webpack config
    let supra_modifier = ({config}) => config;

    // We assemble all `configParts`'s config modifiers into one `supra_modifier`
    configParts
    .forEach(configPart => {
        const modifier = configPart[modifier_name];
        if( ! modifier ) {
            return;
        }
        assert_usage(configPart[modifier_name] instanceof Function);
        const previous_modifier = supra_modifier;
        supra_modifier = (
            args => {
                const config = previous_modifier(args);
                const config__new = modifier({...args, config});
                assert_usage(
                    config__new,
                    (
                        configPart.$name ? (
                            "The `"+modifier_name+"` of `"+configPart.$name+"`"
                        ) : (
                            "A `"+modifier_name+"`"
                        )
                    ) + (
                        " is returning `"+config__new+"` but it should be returning a webpack config instead."
                    )
                );
                return config__new;
            }
        );
    });

    return supra_modifier;
}
