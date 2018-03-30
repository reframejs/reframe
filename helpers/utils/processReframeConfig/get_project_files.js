const assert = require('reassert');
const assert_internal = assert;
const path_module = require('path');
const find = require('@brillout/find');
const getCurrentDir = require('@reframe/utils/getCurrentDir');
const find_reframe_config = require('@reframe/utils/find_reframe_config');

module.exports = get_project_files;

let projectFiles__cache;

function get_project_files(_processed/*, r_objects*/) {
    projectFiles__cache = null;
    Object.defineProperty(
        _processed,
        'projectFiles',
        {
            get: () => {
                if( ! projectFiles__cache ) {
                    projectFiles__cache = getProjectFiles();
                }
                return projectFiles__cache;
            },
            enumerable: true,
            configurable: true,
        }
    );
}

function getProjectFiles() {
    const currentDir = getCurrentDir();

    const {reframeConfigPath, pagesDir} = find_reframe_config(currentDir);

    const projectRootDir = (reframeConfigPath || pagesDir) && path_module.dirname(reframeConfigPath || pagesDir);

    return {reframeConfigPath, pagesDir, projectRootDir};
}
