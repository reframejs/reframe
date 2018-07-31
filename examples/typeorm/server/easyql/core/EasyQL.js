const assert_usage = require('reassert/usage');

module.exports = EasyQL;

function EasyQL () {
    const easyql = this;
    assert_usage(easyql.plugins.length>0);
    easyql.plugins.forEach(plugin => plugin(easyql));
    return easyql;
}
