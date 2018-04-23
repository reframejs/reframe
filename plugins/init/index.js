module.exports = initCommands;

function initCommands() {
    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'init [project-directory]',
                description: 'Create a new Reframe app.',
                options: [],
                action: async projectName => {
                    if( ! projectName ) {
                        showUsageInfo();
                        showUsageExample();
                        return;
                    }
                    scaffoldApp(projectName);
                },
                showUsageExample,
            }
        ],
    };
}

async function scaffoldApp(projectName) {
    const path = require('path');
    const fs = require('fs-extra');
    const relativeToHomedir = require('@brillout/relative-to-homedir');
    const {colorDir, colorCmd, colorPkg, colorUrl, symbolSuccess} = require('@reframe/utils/cliTheme');

    const projectRootDir = path.resolve(process.cwd(), projectName);

    const {homeViewTemplate, homePageTemplate} = require('./templates/homeTemplate');
    const {jsonPkgTemplate, reframeConfigTemplate} = require('./templates/coreFilesTemplate');

    const projectRootDir__pretty = colorDir(relativeToHomedir(projectRootDir))

    console.log(
`
Creating a new Reframe app in ${projectRootDir__pretty}.

Installing ${colorPkg('react')} and ${colorPkg('@reframe/default-kit')}.
This might take a couple of minutes.
`
    );

    const viewTemplate = homeViewTemplate();
    const pageTemplate = homePageTemplate(projectName);
    const pkgTemplate = jsonPkgTemplate(projectName);
    const configTemplate = reframeConfigTemplate();

    // add files to projectName/views
    let viewPath = path.resolve(projectRootDir, 'views');
    let viewFileName = 'homeView.js';
    await fs.outputFile(path.resolve(viewPath, viewFileName), viewTemplate);

    // add files to projectName/pages
    let pagePath = path.resolve(projectRootDir, 'pages');
    let pageFileName = 'homePage.config.js';
    await fs.outputFile(path.resolve(pagePath, pageFileName), pageTemplate);

    // add files to projectName root directory
    await fs.outputFile(path.resolve(projectRootDir, 'package.json'), pkgTemplate);
    await fs.outputFile(path.resolve(projectRootDir, 'reframe.config.js'), configTemplate);
    const gitignoreTemplate = await fs.readFile(path.resolve(__dirname, './templates/gitignore'), 'utf8');
    await fs.outputFile(path.resolve(projectRootDir, '.gitignore'), gitignoreTemplate);

    await npmInstall(projectRootDir);

    await gitInit(projectRootDir);

    console.log(
`
${symbolSuccess} Reframe app created in ${projectRootDir__pretty}.

Inside that directory, you can run commands such as

  ${colorCmd('reframe start')}
    Build and start server for development.

  ${colorCmd('reframe')}
    Display all commands.

  ${colorCmd('reframe eject')}
    Display all ejectables.

  ${colorCmd('reframe eject server')}
    Ejects ~40 LOC giving you control over the Node.JS/hapi server.

Run ${colorCmd('cd '+projectName+' && reframe start')} and go to ${colorUrl('http://localhost:3000')} to explore your new app.
`
    );
}

async function npmInstall(cwd) {
    const runNpmInstall = require('@reframe/utils/runNpmInstall');
    const exitCode = await runNpmInstall({cwd});
}

async function gitInit(cwd) {
    const git = require('@reframe/utils/git');
    await git.init({cwd});
    await git.commit({cwd, message: 'boostrap Reframe app'});
}

function showUsageExample() {
    const {colorCmd} = require('@reframe/utils/cliTheme');

    console.log(
`
  For example:
    ${colorCmd('reframe init my-app')}
`
    );
}

function showUsageInfo() {
    const {colorCmd} = require('@reframe/utils/cliTheme');

    console.log(
`
  Please specify the project directory:
    ${'reframe init '+colorCmd('<project-directory>')}`
    );
}
