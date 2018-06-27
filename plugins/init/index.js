module.exports = {
    $name: require('./package.json').name,
    cliCommands: [
        {
            name: 'init',
            param: '[starter] [project-directory]',
            description: 'Create a new Reframe project.',
            options: [
                {
                    name: "--skip-npm",
                    description: "Skip installing packages with npm. You will have to run `npm install` / `yarn` yourself. Do this if you use Yarn.",
                }
            ],
            action: async ({inputs: [starter, projectDir], options: {skipNpm}}) => {
                const starters = await getStarterList();
                if( ! starter || ! projectDir ) {
                    await showWrongUsage({starters});
                    return;
                }
                if( ! starters.includes(starter) ) {
                    await showStarterDoesntExist({starter, starters});
                    return;
                }
                await runInit({starter, projectDir, skipNpm});
            },
            printAdditionalHelp,
        }
    ],
};

async function getStarterList() {
    const fs = require('fs-extra');
    const pathModule = require('path');

    const startersDir = pathModule.resolve(__dirname, './starters');
    const starters = await fs.readdir(startersDir);
    return starters;
}

async function runInit({starter, projectDir, skipNpm}) {
    const pathModule = require('path');
    const runNpmInstall = require('@reframe/utils/runNpmInstall');

    const {colorDir, colorCmd, colorPkg, colorUrl, symbolSuccess, strDir} = require('@brillout/cli-theme');

    const projectRootDir = pathModule.resolve(process.cwd(), projectDir);
    const projectRootDir__pretty = colorDir(strDir(projectRootDir))

    await scaffoldProject(starter, projectRootDir);

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
`);

    if( ! skipNpm ) {
        console.log(`Installing ${colorPkg('react')} and ${colorPkg('@reframe/react-kit')}.`);
        console.log(`This might take a couple of minutes.`);
        console.log();

        await runNpmInstall(projectRootDir);

        console.log(`${symbolSuccess}Packages installed.`);
        console.log();
    }

    console.log(`Run ${colorCmd('cd '+projectDir+' && reframe start')} and go to ${colorUrl('http://localhost:3000')} to open your new app.`);
    console.log();
}

async function scaffoldProject(starter, projectRootDir) {
    const fs = require('fs-extra');
    const pathModule = require('path');
    const assert = require('assert');

    const starterPath = pathModule.resolve(__dirname, './starters', starter);

    assert(await fs.pathExists(starterPath));

    await fs.copy(starterPath, projectRootDir);

    await lopOffPackageJson(projectRootDir);
}

async function lopOffPackageJson(projectRootDir) {
    const fs = require('fs-extra');
    const pathModule = require('path');

    const packageJsonFile = pathModule.resolve(projectRootDir, './package.json');

    const packageJson = require(packageJsonFile);
    delete packageJson.name;
    delete packageJson.version;
    delete packageJson.private;
    delete packageJson.checkDeps;

    await fs.outputFile(packageJsonFile, JSON.stringify(packageJson, null, 2));
}

async function showStarterDoesntExist({starter, starters}) {
    const {colorError, indent} = require('@brillout/cli-theme');
    console.log();
    console.log(colorError(indent+"Starter `"+starter+"` doesn't exist."));
    console.log();
    await printStarters();
    console.log();
}

async function showWrongUsage({starters}) {
    const {indent} = require('@brillout/cli-theme');

    console.log();
    console.log(indent+'Please specify the starter and the project directory:');
    console.log(indent+indent+'reframe init <starter> <project-directory>');
    console.log();

    printAdditionalHelp();
}

function printUsageExample() {
    const {indent} = require('@brillout/cli-theme');

    console.log(indent+'For example:');
    console.log(indent+indent+'reframe init react-server my-app');
}


async function printStarters() {
    const starters = await getStarterList();
    const {indent} = require('@brillout/cli-theme');
    console.log(indent+'Starters:');
    console.log(starters.map(l => indent+indent+l).join('\n'));
}

async function printAdditionalHelp() {
    printUsageExample();
    console.log();
    await printStarters();
    console.log();
}
