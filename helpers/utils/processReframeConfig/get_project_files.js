const assert = require('reassert');
const assert_internal = assert;
const path_module = require('path');
const find = require('@brillout/find');
const getCurrentDir = require('@reframe/utils/getCurrentDir');
const find_reframe_config = require('@reframe/utils/find_reframe_config');

module.exports = get_project_files;

function get_project_files(_processed/*, r_objects*/) {
    _processed.getProjectFiles = getProjectFiles;
}

function getProjectFiles() {
    const currentDir = getCurrentDir();

    const {reframeConfigPath, pagesDir} = find_reframe_config(currentDir);

    const projectRootDir = (reframeConfigPath || pagesDir) && path_module.dirname(reframeConfigPath || pagesDir);

    return {reframeConfigPath, pagesDir, projectRootDir};
}
