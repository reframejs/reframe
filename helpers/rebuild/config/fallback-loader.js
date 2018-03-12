const loaderUtils = require('loader-utils');
const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

module.exports = loader;
module.exports.raw = true;

function loader(content) {
    const ext = loaderUtils.interpolateName(this, '[ext]', {});
    const is_known_extension = ['js', 'mjs', 'wasm', 'json'].includes(ext);
    const is_not_the_only_loader = this.loaders.length >= 2;
    if( is_known_extension || is_not_the_only_loader ) {
        return content;
    }
    /*
    assert_usage(
        ext!=='json',
        "Add a JSON loader in order to load .json files while using the fallback loader."
    );
    */
    assert_internal(this.loaders.length===1);
    assert_internal(this.loaderIndex===0);
    assert_internal(content.constructor===Buffer);
    /*
    console.log('\n');
    console.log(loaderUtils.interpolateName(this, '[name].[ext]', {}));
    console.log(content.toString().slice(0, 100));
    //*/
    const options = loaderUtils.getOptions(this) || {};
    const fallback = require(options.fallback);
    if( ! fallback.raw ) {
        content = content.toString();
    }
    return fallback.call(this, content);
}
