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
    await fs.outputFile(path.resolve(currentDir, 'package.json'), pkgTemplate);
    await fs.outputFile(path.resolve(currentDir, 'reframe.config.js'), configTemplate);
    const gitignoreTemplate = await fs.readFile(path.resolve(__dirname, './templates/gitignore'), 'utf8');
    await fs.outputFile(path.resolve(currentDir, '.gitignore'), gitignoreTemplate);

    const runNpmInstall = require('@reframe/utils/runNpmInstall');
    const exitCode = await runNpmInstall({cwd: currentDir});
    console.log(`process completed with code: ${exitCode}`);
}
