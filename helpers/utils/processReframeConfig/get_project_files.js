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

    const {output_path__browser} = get_dist_paths({projectRootDir});

    return {
        reframeConfigPath,
        pagesDir,
        projectRootDir,
        staticAssetsDir: output_path__browser,
    };
}


function get_dist_paths({projectRootDir}) {
    if( ! projectRootDir ) {
        return {};
    }
    const output_path__base = path_module.resolve(projectRootDir, './dist');
    const output_path__browser = path_module.resolve(output_path__base, './browser');
    const output_path__server = path_module.resolve(output_path__base, './server');

    return {
        output_path__base,
        output_path__browser,
        output_path__server,
    };
}
