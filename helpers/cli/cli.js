#!/usr/bin/env node

process.on('unhandledRejection', err => {throw err});

const ora = require('ora');
const loading_spinner = ora();
loading_spinner.start();

const getCurrentDir = require('@reframe/utils/getCurrentDir');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert = require('reassert');
const assert_usage = assert;

const cwd = process.cwd();
getCurrentDir.currentDir = cwd;

const projectConfig = getProjectConfig();
const {projectRootDir} = projectConfig.projectFiles;

loading_spinner.stop();

if( projectRootDir ) {
    const reframePackageLocation = require.resolve('@reframe/run', {paths: [projectRootDir]});
    assert_usage(
        reframePackageLocation,
        "Couldn't find the npm package `@reframe/run`.",
        "It is required to run reframe.",
        "TODO Include it `@reframe/run` included in the `package.json` of the project at ``?"
    );
    require(reframePackageLocation);
} else {
    projectLessCli();
}

function projectLessCli() {
    const program = require('commander');
    const pkg = require('./package.json');
    const fs = require('fs-extra');
    const path = require('path');
    const spawn = require('cross-spawn');
    const inquirer = require('inquirer');
    const {questions} = require('./questions');

    let noCommandFound = true;

    program
    .version(pkg.version, '-v, --version')
    .command('init')
    .description('creates new project')
    .action( () => {
        noCommandFound = false;
        inquirer.prompt(questions).then(({projectName, useRedux, plugins}) => {
            scaffoldApp(projectName);
        });
    });

    program
    .arguments('<arg>')
    .action((arg) => {
        noCommandFound = false;
        console.error(`${arg} is not a valid command. Use -h or --help for valid commands.`);
    });

    program.parse(process.argv);

    if( noCommandFound ) {
        program.outputHelp();
    }
}

async function scaffoldApp(projectName) {
    const {homeViewTemplate, homePageTemplate} = require('./templates/homeTemplate');
    const {jsonPkgTemplate, reframeConfigTemplate} = require('./templates/coreFilesTemplate');
    const viewTemplate = homeViewTemplate();
    const pageTemplate = homePageTemplate(projectName);
    const pkgTemplate = jsonPkgTemplate(projectName);
    const configTemplate = reframeConfigTemplate();
    let currentDir = path.resolve(process.cwd(), projectName);

    // add files to projectName/views
    let viewPath = path.resolve(currentDir, 'views');
    let viewFileName = 'homeView.js';
    await fs.outputFile(path.resolve(viewPath, viewFileName), viewTemplate);

    // add files to projectName/pages
    let pagePath = path.resolve(currentDir, 'pages');
    let pageFileName = 'homePage.config.js';
    await fs.outputFile(path.resolve(pagePath, pageFileName), pageTemplate);

    // add files to projectName root directory
    let pkgFileName = 'package.json';
    let configName = 'reframe.config.js';
    await fs.outputFile(path.resolve(currentDir, pkgFileName), pkgTemplate);
    await fs.outputFile(path.resolve(currentDir, configName), configTemplate);

    install(currentDir);
}

function install(directory) {
    const child = spawn('npm', ['install'], { stdio: 'inherit', cwd: directory });

    child.stdout.on('data', data => {
        console.log(data);
    });

    child.on('close', code => {
        console.log(`process completed with code: ${code}`);
    });
}
