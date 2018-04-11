throw new Error('TODO - (re)move that code');



const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const getProjectConfig = require('@reframe/utils/getProjectConfig');
const program = require('commander');
const pkg = require('./package.json');

const assert_internal = require('reassert/internal');

const projectConfig = getProjectConfig();
const {pagesDir: pagesDirPath, projectRootDir: appDirPath, reframeConfigFile} = projectConfig.projectFiles;
assert_internal(pagesDirPath || reframeConfigFile);

let noCommandFound = true;

loading_spinner.stop();

program.parse(process.argv);

if( noCommandFound ) {
    program.outputHelp();
}





function start(prod, showHapiServerLog) {
    log_found_file(reframeConfigFile, 'Reframe config');
    log_found_file(pagesDirPath, 'Pages directory');

    startHapiServer({pagesDirPath, appDirPath, showHapiServerLog});
}

function log_build_success({compilationInfo}) {
    const chalk = require('chalk');
    const browser_compilation_info = compilationInfo[0];
    const {output: {dist_root_directory}} = browser_compilation_info;
    console.log(green_checkmark()+' Frontend built at '+dist_root_directory+' '+env_tag());

    return;

    function env_tag() {
        return (
            is_production() ? (
                chalk.yellow('[PROD]')
            ) : (
                chalk.blueBright('[DEV]')
            )
        );
    }

    function is_production() {
        return process.env.NODE_ENV === 'production';
    }
}

function log_found_file(file_path, description) {
    const relative_to_homedir = require('@brillout/relative-to-homedir');
    if( file_path ) {
        console.log(green_checkmark()+' '+description+' found at '+relative_to_homedir(file_path));
    }
}

function green_checkmark() {
    const chalk = require('chalk');
    return chalk.green('\u2714');
}

