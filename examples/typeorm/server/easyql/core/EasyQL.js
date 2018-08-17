const assert_usage = require('reassert/usage');
const AuthCookieManager = require('./AuthCookieManager');

const internalPlugins = [AuthCookieManager];

module.exports = EasyQL;

function EasyQL () {
    const easyql = this;

    let pluginsAreInstalled = false;

    return new Proxy(easyql, {
        /*
        set: (obj, prop, val) => {
            return obj[prop] = val;
        },
        */
        get: (obj, prop) => {
         // console.log('g', prop);
            if( ! pluginsAreInstalled ) {
                pluginsAreInstalled = true;
                assert_usage(easyql.plugins.length>0);
                [
                    ...internalPlugins,
                    ...easyql.plugins,
                ].forEach(plugin => plugin(easyql));
            }
            return obj[prop];
        },
    });
}
