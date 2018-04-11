const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');
const find = require('@brillout/find');
const getUserDir = require('@brillout/get-user-dir');
const find_reframe_config = require('@reframe/utils/find_reframe_config');
const fs = require('fs');
const getPageInfos = require('webpack-ssr/getPageInfos');

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
}

function getProjectFiles__with_cache() {
    if( ! projectFiles__cache ) {
        projectFiles__cache = getProjectFiles();
    }
    return projectFiles__cache;
}

function getProjectFiles() {
    const userDir = getUserDir();

    const {reframeConfigPath, pagesDir} = find_reframe_config(userDir);

    const projectRootDir = (reframeConfigPath || pagesDir) && pathModule.dirname(reframeConfigPath || pagesDir);

    const {output_path__browser, output_path__server, output_path__base} = get_dist_paths({projectRootDir});

    return {
        // TODO rename to reframeConfigFile
        reframeConfigPath,

        pagesDir,
        projectRootDir,

        // TODO move this to @reframe/build
        staticAssetsDir: output_path__browser,

        buildOutputDir: output_path__base,
    };
}


function get_dist_paths({projectRootDir}) {
    if( ! projectRootDir ) {
        return {};
    }
    const output_path__base = pathModule.resolve(projectRootDir, './dist');
    const output_path__browser = pathModule.resolve(output_path__base, './browser');
    const output_path__server = pathModule.resolve(output_path__base, './server');

    return {
        output_path__base,
        output_path__browser,
        output_path__server,
    };
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

    const pageInfos = getPageInfos({outputDir: buildOutputDir});

    const pageConfigs = (
        pageInfos
        .map(({pageExport, pageAssets}) => {
            const pageConfig = pageExport;

            pageConfig.scripts = make_paths_array_unique([
                ...(pageAssets.scripts||[]),
                ...(pageConfig.scripts||[]),
            ]);

            pageConfig.styles = make_paths_array_unique([
                ...(pageAssets.styles||[]),
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

/*
let time = 0;
setInterval(() => {
    console.log(time);
}, 1000);
*/

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

function assertProjectFound() {
    // TODO
    /*
    assert_usage(
        projectConfig.projectFiles.pagesDir || projectConfig.webpackBrowserConfigModifier && projectConfig.webpackServerConfigModifier,
        "No `pages/` directory found nor is `webpackBrowserConfig` and `webpackServerConfig` defined in `reframe.config.js`."
    );
    */
}

function resolveModule(filePath) {
    try {
        return require.resolve(filePath);
    } catch(e) {}
    return null;
}
