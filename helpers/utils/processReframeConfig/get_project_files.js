const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const path_module = require('path');
const find = require('@brillout/find');
const getCurrentDir = require('@reframe/utils/getCurrentDir');
const find_reframe_config = require('@reframe/utils/find_reframe_config');
const fs = require('fs');
const mime = require('mime'); // TODO remove

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
}

function getProjectFiles__with_cache() {
    if( ! projectFiles__cache ) {
        projectFiles__cache = getProjectFiles();
    }
    return projectFiles__cache;
}

function getProjectFiles() {
    const currentDir = getCurrentDir();

    const {reframeConfigPath, pagesDir} = find_reframe_config(currentDir);

    const projectRootDir = (reframeConfigPath || pagesDir) && path_module.dirname(reframeConfigPath || pagesDir);

    const {output_path__browser, output_path__server, output_path__base} = get_dist_paths({projectRootDir});

    return {
        // TODO rename to reframeConfigFile
        reframeConfigPath,
        pagesDir,
        projectRootDir,
        staticAssetsDir: output_path__browser,
        // TODO move into a subdir
        pagesDir__transpiled: output_path__server,
        buildOutputDir: output_path__base,
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

function getPageConfigPaths() {
    const {pagesDir} = getProjectFiles__with_cache();

    const pageConfigPaths = [];
    const pageConfigPaths__map = {};

    get_page_files({pagesDirPath: pagesDir})
    .forEach(({file_path, file_name, page_name, entry_name, is_dom, is_entry, is_base}) => {
        if( ! is_base ) {
            return;
        }
        assert_usage(
            !pageConfigPaths__map[page_name]
        );
        pageConfigPaths__map[page_name] = true;
        pageConfigPaths.push({
            name: page_name,
            pageFile: file_path,
        });
    });

    return pageConfigPaths;
}

function getPageConfigs({withoutStaticAssets=false}={}) {
    const {pagesDir__transpiled, pagesDir, buildOutputDir} = getProjectFiles__with_cache();

    const pageConfigs_map = {};

    const pageConfigs = (
        fs__ls(pagesDir__transpiled)
        .filter(filePath => filePath.endsWith('.js'))
        .map(file_path => {
            const {page_name} = get_names(file_path);
            assert_internal(page_name);
            const pageConfig = require__magic(file_path);
            assert_pageConfig(pageConfig, file_path);

            pageConfig.pageName = page_name;

            pageConfig.pageConfigFile = (
                path_module.resolve(
                    pagesDir,
                    path_module.relative(pagesDir__transpiled, file_path)
                )
            );
            assert_internal(fs__file_exists(pageConfig.pageConfigFile));

            assert_internal(!pageConfigs_map[page_name]);
            pageConfigs_map[page_name] = true;
            return pageConfig;
        })
    );

    if( withoutStaticAssets ) {
        return pageConfigs;
    }

    const assetMap = readAssetMap({buildOutputDir});

    pageConfigs
    .map(pageConfig => {
        const {pageName} = pageConfig;
        assert_internal(pageName);

        const pageAssets = assetMap[pageName] || {};

        pageConfig.scripts = make_paths_array_unique([
            ...(pageAssets.scripts||[]),
            ...(pageConfig.scripts||[]),
        ]);

        pageConfig.styles = make_paths_array_unique([
            ...(pageAssets.styles||[]),
            ...(pageConfig.styles||[])
        ]);
    });

    return pageConfigs;
}

function assert_pageConfig(pageConfig, pageConfigPath) {
    assert_usage(
        pageConfig && pageConfig.constructor===Object,
        "The page config, defined at `"+pageConfigPath+"`, should return a plain JavaScript object.",
        "Instead it returns: `"+pageConfig+"`."
    );
    assert_usage(
        pageConfig.route,
        pageConfig,
        "The page config, printed above and defined at `"+pageConfigPath+"`, is missing the `route` property."
    );
}

function readAssetMap({buildOutputDir}) {
    const assetMapPath = path__resolve(buildOutputDir, 'assetMap.json');
    return JSON.parse(fs__read(assetMapPath));
}

function get_page_files({pagesDirPath}) {
    return (
        fs__ls(pagesDirPath)
        .filter(is_file)
        .filter(is_file)
        .filter(is_javascript_file)
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
                file_name,
                entry_name,
                page_name,
                is_dom: suffix_dom,
                is_entry: suffix_entry,
                is_base: number_of_suffixes===0,
            };
        })
    );
}

// TODO remove
function is_javascript_file(file_path) {
    assert_internal(check('path/to/file.js'));
    assert_internal(check('./file.js'));
    assert_internal(check('file.web.js'));
    assert_internal(check('file.mjs'));
    assert_internal(check('file.jsx'));
    assert_internal(check('file.web.jsx'));
    assert_internal(check('page.entry.jsx'));
    assert_internal(check('page.entry.js'));
    assert_internal(check('page.dom.js'));
    assert_internal(check('page.html.js'));
    assert_internal(check('page.universal.js'));
    assert_internal(!check('page.css'));

    return check(file_path);

    function check(file_path) {
        let mime_type = mime.getType(file_path);
        if( !mime_type ) {
            return true;
        }
        mime_type = mime_type.toLowerCase();
        if( mime_type.includes('coffeescript') ) {
            return true;
        }
        if( mime_type.includes('javascript') ) {
            return true;
        }
        if( mime_type.includes('jsx') ) {
            return true;
        }
        return false;
    }
}

let time = 0;
/* TODO remove
setInterval(() => {
    console.log(time);
}, 1000);
*/

function fs__ls(dirpath) {
    const beg = new Date();
    assert_internal(path_module.isAbsolute(dirpath));
    /*
    const files = dir.files(dirpath, {sync: true, recursive: false});
    */
    const files = (
        fs.readdirSync(dirpath)
        .map(filename => path__resolve(dirpath, filename))
    );
    files.forEach(filepath => {
        assert_internal(path_module.isAbsolute(filepath), dirpath, files);
        assert_internal(path_module.relative(dirpath, filepath).split(path_module.sep).length===1, dirpath, files);
    });
    time+=new Date() - beg;
    return files;
}

function is_file(file_path) {
    return !fs.lstatSync(file_path).isDirectory();
}

function get_names(file_path) {
    const file_name = path_module.basename(file_path);
    assert_internal(!file_name.includes(path_module.sep));
    const entry_name = file_name.split('.').slice(0, -1).join('.');
    const page_name = file_name.split('.')[0];
    assert_usage(
        entry_name && page_name && file_name,
        "Invalid file name `"+file_path+"`"
    );
    return {file_name, entry_name, page_name};
}

function require__magic(modulePath) {
    const beg = new Date();
    if( ! source_map_installed ) {
        require('source-map-support').install();
        source_map_installed = true;
    }

    delete require.cache[modulePath];
    const module_exports = require(modulePath);

  //time+=new Date() - beg;
    if( module_exports.__esModule === true ) {
        return module_exports.default;
    }
    return module_exports;
}
function path__resolve(path1, path2, ...paths) {
    assert_internal(path1 && path_module.isAbsolute(path1), path1);
    assert_internal(path2);
    return path_module.resolve(path1, path2, ...paths);
}
function fs__file_exists(path) {
    const beg = new Date();
    let exists = false;

    try {
        exists = fs.statSync(path).isFile();
    } catch(e) {}

    time+=new Date() - beg;

    return exists;
}


function fs__read(filepath) {
    return fs.readFileSync(filepath, 'utf8');
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

