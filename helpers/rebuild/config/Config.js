const assert = require('reassert');
const assert_usage = require('reassert/usage');
const merge_configs = require('./utils/webpack_config_mod');

module.exports = Config;

function Config() {
    const parts = [];

    return {
        assemble,
        add,
    };

    function add(parts_) {
        validate_parts(parts_);
        parts.push(...parts_);
    }

    function assemble() {
        assert_usage(parts.length>0);
        const configs = [];
        parts.forEach(part => {
            configs.push(
                ...(
                    part.constructor === Array ? (
                        part
                    ) : (
                        [part]
                    )
                )
            );
            /*
            if( part.constructor===Array ) {
                configs.push(...part);
            } else {
                configs.push(part);
            }
            */
        });
        assert(configs.every(config_fn => config_fn.constructor===Function), configs);
        return merge_configs(configs);
    }

    function validate_parts(parts_) {
        assert_usage(parts_.constructor===Array);
        parts_.forEach(part => {
            assert_usage([Function, Array].includes(part.constructor), parts_);
            if( part.constructor === Array ) {
                part.forEach(config_fn => {
                    assert_usage(config_fn.constructor===Function);
                });
            }
        });
    }
}
