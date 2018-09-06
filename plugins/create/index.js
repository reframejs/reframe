module.exports = {
    $name: require('./package.json').name,
    cliCommands: [
        {
            name: 'create',
            param: '[starter] [project-directory]',
            description: 'Create a new Reframe project.',
            options: [
                {
                    name: "--skip-npm",
                    description: "Skip installing packages with npm. You will have to run `npm install` / `yarn` yourself. Do this if you use Yarn.",
                }
            ],
            action: async ({inputs: [starter='react-frontend', projectDir='my-'+starter], options: {skipNpm}}) => {
                const starters = await getStarterList();
                if( ! starters.includes(starter) ) {
                    await showStarterDoesntExist({starter, starters});
                    return;
                }
                await runCreate({starter, projectDir, skipNpm});
            },
            printAdditionalHelp,
        }
    ],
};

async function getStarterList() {
    const fs = require('fs-extra');
    const pathModule = require('path');

    const startersDir = pathModule.resolve(__dirname, './starters');
    let starters = await fs.readdir(startersDir);

    starters = starters.filter(starterName => starterName!=='react-fullstack-app');

    return starters;
}

async function runCreate({starter, projectDir, skipNpm}) {
    const pathModule = require('path');
    const runNpmInstall = require('@reframe/utils/runNpmInstall');

    const {colorDir, colorCmd, colorPkg, colorUrl, symbolSuccess, strDir} = require('@brillout/cli-theme');

    const projectRootDir = pathModule.resolve(process.cwd(), projectDir);
    const projectRootDir__pretty = colorDir(strDir(projectRootDir))

    await scaffoldProject({starter, projectRootDir, projectRootDir__pretty});

    const introText = [
        '',
        `${symbolSuccess}Reframe app created in ${projectRootDir__pretty}.`,
        '',
        'Inside that directory, you can run commands such as',
        '',
        `  ${colorCmd('reframe dev')}`,
        '    Build and start server for development.',
        '',
        `  ${colorCmd('reframe')}`,
        '    List all commands.',
        '',
        /*
        ...(
            starter!=='react-frontend' ? [] : [
                `  ${colorCmd('reframe eject server')}`,
                '    Ejects ~30 LOC giving you control over the Node.JS/hapi server.',
                '',
            ]
        ),
        */
        `  ${colorCmd('reframe eject')}`,
        '    List all ejectables.',
        '',
    ];

    console.log(introText.join('\n'));

    if( ! skipNpm ) {
        console.log(`Installing dependencies.`);
        console.log(`This might take a couple of minutes.`);
        console.log();

        await runNpmInstall(projectRootDir);

        console.log(`${symbolSuccess}Packages installed.`);
        console.log();
    }

    console.log(`Run ${colorCmd('cd '+projectDir+' && reframe dev')} and go to ${colorUrl('http://localhost:3000')} to open your new app.`);
    console.log();
}

async function scaffoldProject({starter, projectRootDir, projectRootDir__pretty}) {
    const fs = require('fs-extra');
    const pathModule = require('path');
    const assert_internal = require('reassert/internal');
    const assert_usage = require('reassert/usage');
    const {colorError} = require('@brillout/cli-theme');

    const starterPath = pathModule.resolve(__dirname, './starters', starter);

    assert_internal(await fs.pathExists(starterPath));

    assert_usage(
        ! await fs.pathExists(projectRootDir),
        colorError("Directory "+projectRootDir__pretty+" already exists."),
        "Remove it or create your app somewhere else."
    );

    await fs.copy(starterPath, projectRootDir);

    await removeNonStarterCode(projectRootDir);
}

async function removeNonStarterCode(projectRootDir) {
    const fs = require('fs-extra');
    const pathModule = require('path');

    await removeReadmeFiles();
    await cleanPackageJson();

    return;

    async function removeReadmeFiles() {
        const readmeFile = pathModule.resolve(projectRootDir, './readme.md');
        const readmeTemplateFile = pathModule.resolve(projectRootDir, './readme.template.md');

        await fs.remove(readmeFile);
        await fs.remove(readmeTemplateFile);
    }

    async function cleanPackageJson() {
        const packageJsonFile = pathModule.resolve(projectRootDir, './package.json');

        const packageJson = require(packageJsonFile);
        delete packageJson.name;
        delete packageJson.version;
        delete packageJson.private;
        delete packageJson.checkDeps;
        delete packageJson.devDependencies;
        delete packageJson.scripts.docs;

        await fs.outputFile(packageJsonFile, JSON.stringify(packageJson, null, 2));
    }
}

async function showStarterDoesntExist({starter, starters}) {
    const {colorError, indent} = require('@brillout/cli-theme');
    console.log();
    console.log(colorError(indent+"Starter `"+starter+"` doesn't exist."));
    console.log();
    await printStarters();
    console.log();
}

function printUsageExample() {
    const {indent} = require('@brillout/cli-theme');

    console.log(indent+'For example:');
    console.log(indent+indent+'reframe create react-server my-app');
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
