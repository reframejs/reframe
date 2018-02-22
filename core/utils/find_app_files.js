const find_up = require('find-up');
const find = require('@brillout/find');

    function find_reframe_config(cwd) {
        const config_path = find_up.sync('reframe.config', {cwd});
        assert_internal(config_path===null || path_module.isAbsolute(config_path));
        if( ! config_path ) {
            return {reframeConfig: undefined};
        }
        const reframeConfig = require(config_path);
        assert_usage(reframeConfig.constructor===Object);
        return {reframeConfig, reframeConfigPath: config_path};
    }
    function find_pages_dir() {
        const pagesDir = find('pages/', {canBeMissing: true});
        return pagesDir;
    }

    function find(filename, opts={}) {
        const file_path = find(filename, {anchorFile: ['reframe.config', 'reframe.browser.config'], ...opts});
        return file_path;
    }

