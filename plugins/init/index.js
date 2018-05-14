module.exports = initCommands;

function initCommands() {
    const path = require('path');

    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'init',
                param: '[project-directory]',
                description: 'Create a new Reframe project.',
                options: [],
                action: async ({inputs: [projectDir]}) => {
                    if( ! projectDir ) {
                        showUsageInfo();
                        showUsageExample();
                        return;
                    }
                    await runInit(projectDir);
                },
                showUsageExample,
            }
        ],
    };
}

async function runInit(projectDir) {
    const path = require('path');
    const runNpmInstall = require('@reframe/utils/runNpmInstall');

    const {colorDir, colorCmd, colorPkg, colorUrl, symbolSuccess, strDir} = require('@brillout/cli-theme');

    const projectRootDir = path.resolve(process.cwd(), projectDir);
    const projectRootDir__pretty = colorDir(strDir(projectRootDir))

    console.log(
`Creating a new Reframe app in ${projectRootDir__pretty}.

Installing ${colorPkg('react')} and ${colorPkg('@reframe/react-kit')}.
This might take a couple of minutes.
`
    );

    await scaffoldProject(projectRootDir);

 // await runNpmInstall(projectRootDir);

    console.log(
`
${symbolSuccess}Reframe app created in ${projectRootDir__pretty}.

Inside that directory, you can run commands such as

  ${colorCmd('reframe start')}
    Build and start server for development.

  ${colorCmd('reframe')}
    List all commands.

  ${colorCmd('reframe eject server')}
    Ejects ~30 LOC giving you control over the Node.JS/hapi server.

  ${colorCmd('reframe eject')}
    List all ejectables.

Run ${colorCmd('cd '+projectDir+' && reframe start')} and go to ${colorUrl('http://localhost:3000')} to open your new app.
`
    );
}

async function scaffoldProject(projectRootDir) {
    const fs = require('fs-extra');
    const path = require('path');

    await fs.copy(path.resolve(__dirname, './scaffold'), projectRootDir);

    await changeFile(
        path.resolve(projectRootDir, './package.json'),
        (lines, {LINE_ERASER}) => (
            lines
            .map(line => {
                if( line.includes('"name"') && line.includes('_sample-project') ) {
                    return LINE_ERASER;
                }
                if( line.includes('"private": "true"') ) {
                    return LINE_ERASER;
                }
                if( line.includes('"version": "') ) {
                    return LINE_ERASER;
                }
                return line;
            })
        )
    );
}

async function changeFile(filePath, changeAction) {
    const fs = require('fs-extra');
    const assert_internal = require('reassert');

    const LINE_ERASER = Symbol();

    const contentOld = await fs.readFile(filePath, 'utf8');
    const linesOld = contentOld.split('\n');

    const linesNew = changeAction(linesOld, {LINE_ERASER});
    const contentNew = linesNew.filter(line => line!==LINE_ERASER).join('\n');

    assert_internal(contentNew !== contentOld);
    await fs.outputFile(filePath, contentNew);
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
