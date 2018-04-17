const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');
const find = require('@brillout/find');
const getUserDir = require('@brillout/get-user-dir');
const find_reframe_config = require('../find_reframe_config');
const fs = require('fs');

// TODO use projectConfig plugin mod instead
const getAssetInfos = require('webpack-ssr/getAssetInfos');

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

    _processed.getPageConfigPaths = getPageConfigPaths;
    _processed.getPageConfigs = getPageConfigs;
    _processed.assertProjectFound = assertProjectFound;
    _processed.build = build;
    _processed.server = server;
}

function getProjectFiles__with_cache() {
    if( ! projectFiles__cache ) {
        projectFiles__cache = getProjectFiles();
    }
    return projectFiles__cache;
}

function getProjectFiles() {
    const userDir = getUserDir();

    const {reframeConfigFile, pagesDir} = find_reframe_config(userDir);

    const projectRootDir = (reframeConfigFile || pagesDir) && pathModule.dirname(reframeConfigFile || pagesDir);

    const buildOutputDir = pathModule.resolve(projectRootDir, './dist');

    const projectFiles = {
        reframeConfigFile,
        pagesDir,
        projectRootDir,
        buildOutputDir,
    };

    Object.defineProperty(
        projectFiles,
        'staticAssetsDir',
        {
            get: () => {
                const assetInfos = getAssetInfos({outputDir: buildOutputDir});
                return assetInfos.staticAssetsDir;
            },
        }
    );

    return projectFiles;
}

function getPageConfigPaths() {
    const {pagesDir} = getProjectFiles__with_cache();

    return (
        get_page_files({pagesDir})
        .filter(({is_base}) => is_base)
        .map(({file_path}) => file_path)
    )
}

function getPageConfigs() {
    const {buildOutputDir} = getProjectFiles__with_cache();

    const assetInfos = getAssetInfos({outputDir: buildOutputDir});

    const pageConfigs = (
        assetInfos
        .pageAssets
        .map(({pageName, pageExport, styles, scripts}) => {
            const pageConfig = pageExport;

            pageConfig.scripts = make_paths_array_unique([
                ...(scripts||[]),
                ...(pageConfig.scripts||[]),
            ]);

            pageConfig.styles = make_paths_array_unique([
                ...(styles||[]),
                ...(pageConfig.styles||[])
            ]);

            return pageConfig;
        })
    );

    return pageConfigs;
}
function make_paths_array_unique(paths) {
    assert_internal(
        paths.every(
            path => (
                path && path.constructor===Object ||
                path && path.constructor===String && path.startsWith('/')
            )
        ),
        paths
    );
    return [...new Set(paths)];
}

function get_page_files({pagesDir}) {
    return (
        fs__ls(pagesDir)
        .filter(resolveModule)
        .filter(Boolean)
        .map(file_path => {
            const {file_name, entry_name, page_name} = get_names(file_path);

            const file_name_parts = file_name.split('.');

            const suffix_dom = file_name_parts.includes('dom');
            const suffix_entry = file_name_parts.includes('entry');
            const suffix_mixin = file_name_parts.includes('mixin');
            const number_of_suffixes = suffix_dom + suffix_entry + suffix_mixin;
            assert_usage(
                number_of_suffixes <= 1,
                "The file `"+file_path+"` has conflicting suffixes.",
                "Choose only one or none of `.html`, `.dom`, `.entry`, or `.html`, or `.mixin`"
            );

            return {
                file_path,
                is_base: number_of_suffixes===0,
            };
        })
    );

    function get_names(file_path) {
        const file_name = pathModule.basename(file_path);
        assert_internal(!file_name.includes(pathModule.sep));
        const entry_name = file_name.split('.').slice(0, -1).join('.');
        const page_name = file_name.split('.')[0];
        assert_usage(
            entry_name && page_name && file_name,
            "Invalid file name `"+file_path+"`"
        );
        return {file_name, entry_name, page_name};
    }
}
function resolveModule(filePath) {
    try {
        return require.resolve(filePath);
    } catch(e) {}
    return null;
}
function fs__ls(dirpath) {
    const beg = new Date();
    assert_internal(pathModule.isAbsolute(dirpath));
    const files = (
        fs.readdirSync(dirpath)
        .map(filename => pathModule.resolve(dirpath, filename))
    );
    files.forEach(filepath => {
        assert_internal(pathModule.isAbsolute(filepath), dirpath, files);
        assert_internal(pathModule.relative(dirpath, filepath).split(pathModule.sep).length===1, dirpath, files);
    });
 // time+=new Date() - beg;
    return files;
}
/*
let time = 0;
setInterval(() => {
    console.log(time);
}, 1000);
*/

function assertProjectFound() {
    // TODO
    /*
    assert_usage(
        projectConfig.projectFiles.pagesDir || projectConfig.webpackBrowserConfigModifier && projectConfig.webpackServerConfigModifier,
        "No `pages/` directory found nor is `webpackBrowserConfig` and `webpackServerConfig` defined in `reframe.config.js`."
    );
    */
}

function build() {
    const {projectRootDir} = getProjectFiles__with_cache();
    assert_internal(projectRootDir);
    return require(resolvePackagePath('@reframe/build', projectRootDir));

}

function server() {
    const {projectRootDir} = getProjectFiles__with_cache();
    assert_internal(projectRootDir);
    const server = require(resolvePackagePath('@reframe/server', projectRootDir));
    return server();
}

function resolvePackagePath(packageName, projectRootDir) {
    assert_internal(projectRootDir);

    let packagePath;
    try {
        packagePath = require.resolve(packageName, {paths: [projectRootDir]});
    } catch(err) {
        if( err.code!=='MODULE_NOT_FOUND' ) throw err;
        assert_usage(
            false,
            "Package `"+packageName+"` is missing.",
            "You need to install it: `npm install "+packageName+"`.",
            "Project in question: `"+projectRootDir+"`.",
        );
    }

    assert_internal(packagePath);
    return packagePath;
}

