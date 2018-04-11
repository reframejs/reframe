const assert_usage = require('reassert/usage');
const assert_internal = require('reassert/internal');

module.exports = assert_pageConfig;

function assert_pageConfig(pageConfig, pageConfigPath) {
    assert_internal(pageConfigPath);
    assert_usage(
        pageConfig && pageConfig.constructor===Object,
        "The page config, defined at `"+pageConfigPath+"`, should return a plain JavaScript object.",
        "Instead it returns: `"+pageConfig+"`."
    );
    assert_usage(
        pageConfig.route,
        pageConfig,
        "The page config, printed above and defined at `"+pageConfigPath+"`, is missing the `route` property."
    );
}
