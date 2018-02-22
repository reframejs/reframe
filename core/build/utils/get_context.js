const assert = require('reassert');
const assert_internal = assert;
const get_caller = require('parent-module');
const path_module = require('path');

module.exports = {get_context};

function get_context() {
    return path_module.dirname(parent_module());
}

function parent_module() {
    const caller_path = get_caller(__filename);
    assert_internal(caller_path && path_module.isAbsolute(caller_path), __filename);
    let caller_caller_path = get_caller(caller_path);
    if( caller_caller_path.startsWith('file:///') ) {
        caller_caller_path = caller_caller_path.slice('file://'.length);
    }
    assert_internal(caller_caller_path && path_module.isAbsolute(caller_caller_path), __filename, caller_caller_path);
    return caller_caller_path;
}
