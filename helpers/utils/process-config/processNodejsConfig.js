const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_plugin = assert_usage;
const path_module = require('path');
const {get_r_objects, get_view_wrappers} = require('./process_common');
const get_project_files = require('./get_project_files');

module.exports = {processNodejsConfig};

function processNodejsConfig({reframeConfig, extraPlugins}) {
    assert_internal(reframeConfig===null || reframeConfig.constructor===Object);
    assert_internal(extraPlugins.constructor===Array);

    const _processed = {};

    const r_objects = get_r_objects(reframeConfig, extraPlugins);

    get_browser_config_paths(_processed, r_objects);
    get_view_wrappers(_processed, r_objects);
    get_project_files(_processed, r_objects);
    get_cli_commands(_processed, r_objects);
    get_transparent_fields(_processed, r_objects);
    get_ejectables(_processed, r_objects);

    return _processed;
}

// Here we collect all paths of browser-side reframe config files
//  - We define browser-side config objects as paths (instead of loaded module) because the browser-side code is bundled separately from the sever-side code
function get_browser_config_paths(_processed, r_objects) {
    const browserConfigFiles = _processed.browserConfigFiles = [];
    r_objects.forEach(r_object => {
        const {browserConfigFile} = r_object;
        if( ! browserConfigFile ) {
            return;
        }
        assert_usage(browserConfigFile && path_module.isAbsolute(browserConfigFile));
        browserConfigFiles.push(browserConfigFile);
    });
}

function get_cli_commands(_processed, r_objects) {
    const allCliCommands = _processed.allCliCommands = [];

    r_objects
    .forEach(r_object => {
        if (r_object.cliCommands) {
            r_object.cliCommands.forEach(command => {
                allCliCommands.push(command);
            });
        }
    });
}

function get_transparent_fields(_processed, r_objects) {
    const transparentKeys = ['serverEntryFile', 'browserEntryFile', 'renderToHtml', 'router', 'githubPagesRepository'];

    _processed.build = {};
    r_objects
    .reverse()
    .forEach(r_object => {
        if (r_object.build) {
            ['executeBuild', 'getBuildInfo']
            .forEach(buildFunctionName => {
                if( r_object.build[buildFunctionName] ) {
                    _processed.build[buildFunctionName] = r_object.build[buildFunctionName];
                }
            });
        }
        transparentKeys.forEach(key => {
            if (r_object[key]) {
                _processed[key] = r_object[key];
            }
        });
    });
}

function get_ejectables(_processed, r_objects) {
    const ejectables = _processed.ejectables = {};
    r_objects
    .reverse()
    .forEach(r_object => {
        if( r_object.ejectables ) {
            r_object.ejectables.forEach(ejectable => {
                const {name} = ejectable;
                assert_plugin(name);
                assert_plugin(!ejectables[name], r_objects, ejectables, name);

                const ejectableSpec = {...ejectable};

                assert_internal(r_object.name);
                ejectableSpec.packageName = r_object.name;

                ejectables[name] = ejectableSpec;
            });
        }
    });
}
