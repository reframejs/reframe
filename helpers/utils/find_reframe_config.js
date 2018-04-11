const assert = require('reassert');
const assert_internal = assert;
const path_module = require('path');
const find = require('@brillout/find');
const find_up = require('find-up');

module.exports = find_stuff;

function find_stuff(cwd) {
    let reframeConfigFile = find_reframe_config(cwd);

    const pagesDir = find_pages_dir(cwd);

    if( !reframeConfigFile && pagesDir ) {
        reframeConfigFile = find_reframe_config(pagesDir);
    }

    return {reframeConfigFile, pagesDir};
}

function find_pages_dir(cwd) {
    const pagesDir = find('pages/', {anchorFiles: ['reframe.config.js', 'package.json', '.git'], canBeMissing: true, cwd});
    assert_internal(pagesDir===null || path_module.isAbsolute(pagesDir));
    return pagesDir;
}

function find_reframe_config(cwd) {
    const reframeConfigFile = find_up.sync('reframe.config.js', {cwd});
    assert_internal(reframeConfigFile===null || path_module.isAbsolute(reframeConfigFile));
    return reframeConfigFile;
}
