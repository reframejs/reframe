module.exports = {
    $name: require('./package.json').name,
    cliCommands: [
        {
            name: 'create',
            param: '[starter] [app-directory]',
            description: 'Create a new Reframe app.',
            options: [
                {
                    name: "--skip-npm",
                    description: "Skip installing packages with npm. You will have to run `npm install` / `yarn` yourself. Do this if you use Yarn.",
                }
            ],
            action: async ({inputs: [starter, appDir='my-'+starter], options: {skipNpm}, printHelp}) => {
                if( ! starter ) {
                    printHelp();
                    return;
                }

                const starters = await getStarterList();
                if( ! starters.includes(starter) ) {
                    await showStarterDoesntExist({starter, starters});
                    return;
                }

                await runCreate({starter, appDir, skipNpm});
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

    const RECOMMANDED = 'react-frontend';
    const REMOVED = 'react-fullstack-app';

    starters = (
        starters
        .filter(starterName => starterName!==REMOVED)
        .sort((starterName1, starterName2) => (starterName2===RECOMMANDED) - (starterName1===RECOMMANDED))
    );

    return starters;
}
async function getRecommandedStarter() {
    const starters = await getStarterList();
    return starters[0];
}

async function runCreate({starter, appDir, skipNpm}) {
    const pathModule = require('path');
    const runNpmInstall = require('@reframe/utils/runNpmInstall');

    const {colorDir, colorCmd, colorPkg, colorUrl, symbolSuccess, strDir} = require('@brillout/cli-theme');

    const appRootDir = pathModule.resolve(process.cwd(), appDir);
    const appRootDir__pretty = colorDir(strDir(appRootDir))

    await scaffoldApp({starter, appRootDir, appRootDir__pretty});

    const introText = [
        '',
        `${symbolSuccess}Reframe app created in ${appRootDir__pretty}.`,
        '',
        'Inside that directory, you can run commands such as',
        '',
        `  ${colorCmd('reframe dev')}`,
        '    Build pages and start server for development.',
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

        await runNpmInstall(appRootDir);

        console.log(`${symbolSuccess}Packages installed.`);
        console.log();
    }

    console.log(`Run ${colorCmd('cd '+appDir+' && reframe dev')} and go to ${colorUrl('http://localhost:3000')} to open your new app.`);
    console.log();
}

async function scaffoldApp({starter, appRootDir, appRootDir__pretty}) {
    const fs = require('fs-extra');
    const pathModule = require('path');
    const assert_internal = require('reassert/internal');
    const assert_usage = require('reassert/usage');
    const {colorError} = require('@brillout/cli-theme');

    const starterPath = pathModule.resolve(__dirname, './starters', starter);

    assert_internal(await fs.pathExists(starterPath));

    assert_usage(
        ! await fs.pathExists(appRootDir),
        colorError("Directory "+appRootDir__pretty+" already exists."),
        "Remove it or create your app somewhere else."
    );

    await fs.copy(starterPath, appRootDir);

    await removeNonStarterCode(appRootDir);
}

async function removeNonStarterCode(appRootDir) {
    const fs = require('fs-extra');
    const pathModule = require('path');

    await removeReadmeFiles();
    await cleanPackageJson();

    return;

    async function removeReadmeFiles() {
        const readmeFile = pathModule.resolve(appRootDir, './readme.md');
        const readmeTemplateFile = pathModule.resolve(appRootDir, './readme.template.md');

        await fs.remove(readmeFile);
        await fs.remove(readmeTemplateFile);
    }

    async function cleanPackageJson() {
        const packageJsonFile = pathModule.resolve(appRootDir, './package.json');

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

async function printUsageExample() {
    const {indent} = require('@brillout/cli-theme');

    console.log(indent+'For example:');
    const recommandedStarter = await getRecommandedStarter();
    console.log(indent+indent+'reframe create '+recommandedStarter+' my-app');
}

async function printStarters() {
    const starters = await getStarterList();
    const {indent} = require('@brillout/cli-theme');
    console.log(indent+'Starters:');
    const recommandedStarter = await getRecommandedStarter();
    console.log(
        starters
        .map(starterName => indent+indent+starterName/*+(recommandedStarter===starterName?' (recommanded)':'')*/)
        .join('\n')
    );
}

async function printAdditionalHelp() {
    await printUsageExample();
    console.log();
    await printStarters();
    console.log();
}
