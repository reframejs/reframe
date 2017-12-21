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
    assert_internal(caller_path && caller_path.startsWith('/'), __filename);
    const caller_caller_path = get_caller(caller_path);
    assert_internal(caller_caller_path && caller_caller_path.startsWith('/'), __filename);
    /*
    console.log(3213, caller_caller_path);
    throw new Error('uehi');
    //*/
    return caller_caller_path;
}
