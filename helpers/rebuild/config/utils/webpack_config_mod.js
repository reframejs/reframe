const assert = require('reassert');
const log = require('reassert/log');
const assert_usage = require('reassert/usage');
const assert_warning = require('reassert/warning');
const _ = require('lodash');

module.exports = merge_configs;

function merge_configs(config_parts) {
    const config_writable = merge_writable(config_parts);

 // log(config_writable);

    const config_readonly = apply_transformations(config_writable);

 // log(config_readonly);

    return config_readonly;
}


function merge_writable(config_parts) {
    assert_usage(config_parts.every(part => !part || part instanceof Function));
    let config_interim = {};

    config_parts
    .filter(Boolean)
    .forEach(part => {
        config_interim = _.mergeWith(
            {},
            config_interim,
            part(config_interim),
            (objValue, srcValue) => _.isArray(objValue) ? objValue.concat(srcValue) : undefined,
        );
    });

    return config_interim;
}

function apply_transformations(obj) {
    /*
    if( obj instanceof Array ) {
        return obj;
    }
    */
    if( obj && obj._transformer ) {
        assert_usage(obj.constructor===Object);
        const obj_copy = _.merge({}, obj);
        const {_transformer} = obj_copy;
        delete obj_copy._transformer;

        return _transformer(obj_copy);
    }
    if( !obj || obj.constructor!==Object ) {
        return obj;
    }
    return _.mapValues(obj, apply_transformations);
}

/*
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MERGE_TEST = Symbol();


module.exports = {merge_all_configs, MERGE_TEST};

function merge_all_configs({config_parts}) {
    let config__overall = null;

    config_parts
    .forEach(conf => {
        assert([Function, Object].includes(conf.constructor), conf);
        const config_addendum = (
            turn_single_config_to_config_list({
                default_config_name: 'browser',
                config: (
                    conf.constructor===Function ?
                        conf({config: config__overall}) :
                        conf
                ),
            })
        );
        validate_config_list(config_addendum);
        config__overall = merge_two_configs(config__overall, config_addendum);
        validate_config_list(config__overall);
    });

    process_config(config__overall);

    validate_config_list(config__overall);

    const config_list = Object.values(config__overall).filter(Boolean);
    assert(config_list.length===1, config_list, config__overall);
    return config_list[0];
}

function process_config(config__overall) {
    validate_config_list(config__overall);
    Object.entries(config__overall)
    .filter(([_, config]) => config!==null)
    .forEach(([config_name, config]) => {
        validate_single_config(config, config_name);

        const is_extracting_css = !!(config.plugins||{}).extract_text_plugin;
        apply_config_array_keys(config);

        if( is_extracting_css ) {
            apply_css_extract(config);
        }
    })
}

function is_a_css_rule(rule) {
    const useS = rule.use.constructor!==Array ? [rule.use] : rule.use;

    useS.forEach(u => get_loader(u, rule));

    if( get_loader(useS[0]) === 'style-loader' ) {
        assert(useS.length>=2);
        assert_warning(get_loader(useS[1])==='css-loader', "Not sure how to handle following rule that uses `style-loader` but not `css-loader`", rule);
        return true;
    }

    assert_warning(!useS.some(u => get_loader(u)==='style-loader'), "Not sure how to handle following rule in regards to extract css into separate file", rule);

    return false;
}

function get_loader(use, rule) {
    let loader;
    if( use.constructor === String ) {
        loader = use;
    } else {
        loader = use.loader;
    }

    assert_usage(loader, "Property `loader` not found at following use of following rule:", use, rule);
    assert_usage(loader.endsWith('-loader'), "The loader name `"+loader+"` doesn't end with `'-loader'` at following rule:", rule);

    return loader;
}

const webpack_top_level_options = [
  'entry',
  'output',
  'module',
  'resolve',
  'plugins',
  'devServer',
  'devtool',
  'context',
  'target',
  'watch',
  'WatchOptions',
  'externals',
  'performance',
  'node',
  'stats',

  'resolveLoader',
  'amd',
  'bail',
  'cache',
  'parallelism',
  'profile',
  'recordsPath',
  'recordsInputPath',
  'recordsOutputPath',
];

function validate_single_config(config, config_name) {
    // as per https://webpack.js.org/configuration
    assert(config instanceof Object, config, config_name);

    Object.keys(config).forEach(key => {
        assert_usage(webpack_top_level_options.includes(key), config, key, config_name);
    });
    assert_usage(!config.rules, "Property `rules` is defined on the root webpack config object but it should be defined on the `module` object", config);

    assert_usage(!config.loaders && !(config.module||{}).loaders, "Using `loaders` is deprecated, use `rules` instead", config);
    assert(!(config.module||{}).rules || [Array, Object].includes(config.module.rules.constructor));

    if( (config.module||{}).rules ) {
        const malformed_rules = Object.values(config.module.rules).filter(rule => rule.loaders || rule.loader || !rule.use);
        assert_usage(
            malformed_rules.length===0,
            "Malformed rules;", malformed_rules, "Define property `use` to specify loaders (instead of `loaders` and `loader`)"
        );
    }
}
function validate_config_list(config__overall) {

    Object.entries(config__overall)
    .forEach(([config_name, config]) => {
        if( config===null ) {
            return;
        }

        assert_usage(config_name);
        assert_usage(!(config_name>=0), config_name);
        assert_usage(!webpack_top_level_options.includes(config_name), config, config_name);

        validate_single_config(config, config_name);
    });

}

function turn_single_config_to_config_list({config, default_config_name}) {
    assert(config);
    assert(default_config_name);
    if( Object.keys(config).every(key => webpack_top_level_options.includes(key))) {
        return {
            [default_config_name]: config,
        };
    }
    return config;
}

function merge_two_configs(config1, config2) {

    if( (config1||0).constructor === Object ) {
        if( config2===undefined ) {
            config2 = {};
        }
        if( (config2||0).constructor === Object ) {
            const merged = {};
            unique([...Object.keys(config1), ...Object.keys(config2)])
            .forEach(key => {
                merged[key] = merge_two_configs(config1[key], config2[key]);
            });
            return merged;
        }
    }

    if( (config1||0).constructor === Array ) {

        const config2__array_elements = (() => {
            if( (config2||{}).length>=0 ) {
                return config2;
            }
            return [];
        })();

        return (
            Object.assign(
                unique([...config1, ...config2__array_elements]),
                get_non_array_obj(config1),
                get_non_array_obj(config2)
            )
        );
    }

    return config2===undefined ? config1 : config2;

    function unique(arr) {
        return Array.from(new Set(arr));
    }
}

function apply_config_array_keys(config) {
    assert(config.constructor===Object);
    Object.values(config)
    .forEach(val => {
        if( val.constructor === Object ) {
            apply_config_array_keys(val);
        }
        if( val.constructor === Array ) {
            Object.keys(get_non_array_obj(val))
            .forEach(key => {
                const v = val[key];
                if( [null, undefined].includes(v) ) {
                    delete val[key];
                    return;
                }
                assert(MERGE_TEST);
                if( v[MERGE_TEST] && ! v[MERGE_TEST](val) ) {
                    return;
                }
                val.push(v);
                delete val[key];
            });
        }
    });
}

function apply_css_extract(config) {
    ((config.module||{}).rules||[])
    .forEach((rule, i) => {
        if( ! is_a_css_rule(rule) ) {
            return rule;
        }

        assert(!rule.loader);
        assert(!rule.loaders);
        assert(rule.use);
        assert(get_loader(rule.use[0])==='style-loader');

        config.module.rules[i] = (
            Object.assign({}, rule, {
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: rule.use.slice(1),
                }),
            })
        );
    });
}

function get_non_array_obj(arr) {
    if( !arr ) {
        return {};
    }
    if( arr.constructor===Object ) {
        return arr;
    }
    assert(arr.constructor===Array, arr);
    const obj = {};
    Object.entries(arr)
    .forEach(([key, val]) => {
        assert('0'>=0);
        if( key>=0 ) {
            return;
        }
        obj[key] = val;
    });
    return obj;
}
*/
