module.exports = initCommands;

function initCommands() {
    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'init',
                description: 'creates new project',
                options: [],
                action: async options => {
                    const inquirer = require('inquirer');
                    const {questions} = require('./questions');

                    inquirer.prompt(questions).then(({projectName, useRedux, plugins}) => {
                        scaffoldApp(projectName);
                    });
                },
            }
        ],
    };
}

async function scaffoldApp(projectName) {
    const path = require('path');
    const fs = require('fs-extra');
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
    const spawn = require('cross-spawn');

    const child = spawn(
        'npm',
        [
            'install',
            '--save',
            '--loglevel',
            'error',
            // We let the user decide whether to user `yarn.lock` or `package-lock.json`
            '--no-package-lock',
        ],
        { stdio: 'inherit', cwd: directory }
    );

    child.on('close', code => {
        console.log(`process completed with code: ${code}`);
    });
}
