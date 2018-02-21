const assert = require('reassert');
const assert_internal = assert;
const crypto = require('crypto');

module.exports = {compute_file_hash};

function compute_file_hash(str) {
    assert_internal(str.constructor===String, str);
    return (
        crypto
        .createHash('md5')
        .update(str, 'utf8')
        .digest('base64')
        .replace(/=+$/, '')
    );
}

