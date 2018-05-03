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
    const {colorDir, colorCmd, colorPkg, colorUrl, symbolSuccess, strDir} = require('@brillout/cli-theme');

    const projectRootDir = path.resolve(process.cwd(), projectName);

    const {homeViewTemplate, homePageTemplate} = require('./templates/homeTemplate');
    const {jsonPkgTemplate, reframeConfigTemplate} = require('./templates/coreFilesTemplate');

    const projectRootDir__pretty = colorDir(strDir(projectRootDir))

    console.log(
`
Creating a new Reframe app in ${projectRootDir__pretty}.

Installing ${colorPkg('react')} and ${colorPkg('@reframe/react-kit')}.
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
    List all commands.

  ${colorCmd('reframe eject server')}
    Ejects ~30 LOC giving you control over the Node.JS/hapi server.

  ${colorCmd('reframe eject')}
    List all ejectables.

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

    if( ! await git.gitIsInstalled() ) {
        console.log(
`
Git repository not initialized as Git is not installed.`
        );
        return;
    }

    await git.init({cwd});

    if( ! await git.gitIsConfigured({cwd}) ) {
        console.log(
`
Initial code not commited as your Git user name and/or email is not configured.`
        );
        return;
    }

    await git.commit({cwd, message: 'boostrap Reframe app'});
}

function showUsageExample() {
    const {colorCmd} = require('@brillout/cli-theme');

    console.log(
`
  For example:
    ${colorCmd('reframe init my-app')}
`
    );
}

function showUsageInfo() {
    const {colorCmd} = require('@brillout/cli-theme');

    console.log(
`
  Please specify the project directory:
    ${'reframe init '+colorCmd('<project-directory>')}`
    );
}
