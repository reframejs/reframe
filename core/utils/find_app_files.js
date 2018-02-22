const find_up = require('find-up');
const find = require('@brillout/find');
const path_module = require('path');

module.exports = {find_app_files};

function find_app_files(cwd) {
    assert_internal(cwd);

    const pagesDir = find_pages_dir(cwd);

    const reframeConfigPath = find_reframe_config(cwd);

    const appDirPath = (reframeConfigPath || pagesDir) && path_module.dirname(reframeConfigPath || pagesDir);

    return {reframeConfigPath, pagesDir, appDirPath}
}

function find_reframe_config(cwd) {
    const reframeConfigPath = find_up.sync('reframe.config', {cwd});
    assert_internal(reframeConfigPath===null || path_module.isAbsolute(reframeConfigPath));
    return reframeConfigPath;
}

function find_pages_dir(cwd) {
    const pagesDir = find('pages/', {anchorFile: ['reframe.config'], canBeMissing: true, cwd});
    assert_internal(pagesDir===null || path_module.isAbsolute(pagesDir));
    return pagesDir;
}
