const path_module = require('path');
const assert = require('reassert');
const assert_internal = assert;
const find_up = require('find-up');
const find = require('@brillout/find');

module.exports = {find_app_files};

function find_app_files(cwd) {
    assert_internal(cwd);

    let reframeConfigPath = find_reframe_config(cwd);

    const pagesDirPath = find_pages_dir(cwd);

    if( ! reframeConfigPath && pagesDirPath ) {
        reframeConfigPath = find_reframe_config(pagesDirPath);
    }

    const appDirPath = (reframeConfigPath || pagesDirPath) && path_module.dirname(reframeConfigPath || pagesDirPath);

    return {reframeConfigPath, pagesDirPath, appDirPath}
}

function find_reframe_config(cwd) {
    const reframeConfigPath = find_up.sync('reframe.config.js', {cwd});
    assert_internal(reframeConfigPath===null || path_module.isAbsolute(reframeConfigPath));
    return reframeConfigPath;
}

function find_pages_dir(cwd) {
    const pagesDirPath = find('pages/', {anchorFiles: ['reframe.config.js', 'package.json', '.git'], canBeMissing: true, cwd});
    assert_internal(pagesDirPath===null || path_module.isAbsolute(pagesDirPath));
    return pagesDirPath;
}
