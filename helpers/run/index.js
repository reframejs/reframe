const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const getProjectConfig = require('@reframe/utils/getProjectConfig');
const program = require('commander');
const pkg = require('./package.json');

const assert_internal = require('reassert/internal');

const projectConfig = getProjectConfig();
const {pagesDir: pagesDirPath, projectRootDir: appDirPath, reframeConfigPath} = projectConfig.projectFiles;
assert_internal(pagesDirPath || reframeConfigPath);

let noCommandFound = true;

program
.version(pkg.version, '-v, --version')
.command('start')
.description('starts dev server on localhost')
.option("-p, --production", "start for production")
.option("-l, --log", "prints build and page information")
.action( (options) => {
    noCommandFound = false;
    start(options.production, options.log);
});

program
.arguments('<arg>')
.action((arg) => {
    noCommandFound = false;
    console.error(`${arg} is not a valid command. Use -h or --help for valid commands.`);
});

projectConfig
.cli_commands
.forEach(command => {
    program
    .command(command.name)
    .description(command.description)
    .action(function() {
        noCommandFound = false;
        command.action.apply(this, arguments);
    });
});

loading_spinner.stop();

program.parse(process.argv);

if( noCommandFound ) {
    program.outputHelp();
}


function start(prod, showHapiServerLog) {
    log_found_file(reframeConfigPath, 'Reframe config');
    log_found_file(pagesDirPath, 'Pages directory');

    if( prod ) {
        process.env['NODE_ENV']='production';
    }

    startHapiServer({pagesDirPath, appDirPath, showHapiServerLog});
}

async function startHapiServer({pagesDirPath, appDirPath, showHapiServerLog}) {
    const createHapiServer = require('@reframe/server/createHapiServer');

    const reframeConfig = {_processed: projectConfig};

    const {server} = await createHapiServer({
        pagesDirPath,
        reframeConfig,
        appDirPath,
        logger: {onFirstCompilationSuccess: log_build_success},
        log: showHapiServerLog
    });

    await server.start();

    log_server_started(server);
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

function log_server_started(server) {
    console.log(green_checkmark()+' Server running at '+server.info.uri);
}

function green_checkmark() {
    const chalk = require('chalk');
    return chalk.green('\u2714');
}

