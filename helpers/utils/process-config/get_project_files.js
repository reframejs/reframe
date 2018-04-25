const pathModule = require('path');
const findProjectFiles = require('../findProjectFiles');
const getPageConfigFiles = require('../getPageConfigFiles');

module.exports = get_project_files;

let projectFiles__cache;
let source_map_installed;

function get_project_files(_processed/*, r_objects*/) {
    projectFiles__cache = null;
    Object.defineProperty(
        _processed,
        'projectFiles',
        {
            get: getProjectFiles__with_cache,
            enumerable: true,
            configurable: true,
        }
    );

    _processed.getPageConfigFiles = () => {
        const {pagesDir} = getProjectFiles__with_cache();
        return getPageConfigFiles({pagesDir});
    };
}

function getProjectFiles__with_cache() {
    if( ! projectFiles__cache ) {
        projectFiles__cache = getProjectFiles();
    }
    return projectFiles__cache;
}

function getProjectFiles() {
    const {reframeConfigFile, pagesDir, projectRootDir, packageJsonFile} = findProjectFiles({projectNotRequired: true});

    const buildOutputDir = projectRootDir && pathModule.resolve(projectRootDir, './dist');

    return {
        reframeConfigFile,
        packageJsonFile,
        pagesDir,
        projectRootDir,
        buildOutputDir,
    };
}

