const {transparentGetter} = require('@brillout/reconfig/getters');

const cmdDescription = 'Deploy to a Git build repository.';

module.exports = {
    $name: require('./package.json').name,
    $getters: [
        transparentGetter('buildRepository'),
    ],
    cliCommands: [
        {
            name: 'deploy-static',
            description: cmdDescription,
            action: runDeploy,
        }
    ],
};

async function runDeploy() {
    const reconfig = require('@brillout/reconfig');
    const path = require("path");
    const git = require('@reframe/utils/git');
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const Confirm = require('prompt-confirm');
    const moment = require('moment');
    const {colorError, colorEmphasisLight, strDir, strDir_emphasisFile, loadingSpinner, symbolSuccess, indent} = require('@brillout/cli-theme');

    const reframeConfig = reconfig.getConfig({configFileName: 'reframe.config.js'});
    const configFile = reframeConfig.$configFile;
    assert_internal(configFile);

    assert_usage(
        reframeConfig.getBuildInfo
    );

    const buildInfo = reframeConfig.getBuildInfo({requireProductionBuild: true});
    const {staticAssetsDir, buildEnv, pageConfigs, buildTime} = buildInfo;
    assert_internal(buildEnv==='production');
    assert_internal(buildTime);

    const buildTimeText = 'from '+moment(buildTime).fromNow();
    const buildText = "build "+colorEmphasisLight(buildTimeText);

    const htmlDynamicPages = (
        pageConfigs
        .filter(pageConfig => !pageConfig.htmlStatic)
    );
    assert_usage(
        htmlDynamicPages.length===0,
        "Trying to statically deploy "+buildText,
        "",
        "But static deploy only works with HTML-static apps.",
        "",
        "All your page configs need `htmlStatic: true` but the following built pages don't:",
        htmlDynamicPages
        .map(pageConfig => {
            return "  "+pageConfig.pageName+" ("+pageConfig.pageFile+")";
        })
        .join('\n'),
        "",
        "Change your page configs accordingly and rebuild."
    );

    const {buildRepository} = reframeConfig;
    assert_usage(
        buildRepository && buildRepository.remote,
        "Config `buildRepository.remote` missing.",
        "",
        "Create a new Git repository.",
        "",
        "Then add the repository's address to "+
        colorEmphasisLight("buildRepository.remote")+
        " in "+
        strDir_emphasisFile(configFile)+
        ".",
        "",
        "Example: ",
        (
`
    // reframe.config.js

    module.exports = {
        $plugins [
            require('@reframe/react-kit'),
        ],
        buildRepository: {
            remote: 'git@github.com:username/repo',
            branch: 'master', // optional, default is \`master\`
        },
    };`
        )
    );

    console.log();
    console.log("Deploying "+buildText+".");
    console.log();

    assert_usage(
        await git.gitIsAvailable(),
        "Git doesn't seem to be installed.",
        "You need to install git."
    );

    const cwd = staticAssetsDir;

    await git.init({cwd});

    assert_usage(
        await git.gitIsConfigured({cwd}),
        "Git user name and/or email is not configured.",
        "You need to add your user name and email to git."
    );

    const {remote, branch='master'} = buildRepository;

    const remoteText = ' '+colorEmphasisLight(branch)+' of '+colorEmphasisLight(remote);
    const loadingText = remoteText;
    loadingSpinner.start({text: 'Loading'+loadingText});

    await git.addRemote({cwd, remote, name: 'origin'});

    await git.fetch({cwd, remote: 'origin', branch});

    await git.reset({cwd, args: ['FETCH_HEAD']});

    await git.branch({cwd, args: ['-u', 'origin/'+branch]});

    const readmePath = await git.checkoutReadme({cwd});
    if( ! readmePath ) {
        writeReadme({cwd});
    }

    loadingSpinner.stop();
    console.log(symbolSuccess+'Loaded'+loadingText+' at '+colorEmphasisLight(strDir(cwd)));
    console.log();

    const {commit: commitHash} = await git.commit({cwd, message: 'Build from '+buildTime.toString()});

    if( ! commitHash ) {
        console.log(symbolSuccess+"Already deployed.");
        console.log(indent+"(No new commits to push to "+remoteText+".)");
        console.log();
        return;
    }

    const commitInfo = await git.show({cwd, args: [commitHash, '--name-only']});

    console.log(symbolSuccess+'New commit:');
    console.log();
    console.log(commitInfo);

    const confirmText = 'Deploy build '+buildTimeText+'? (By pushing commit '+colorEmphasisLight(commitHash)+' to'+remoteText+'.)';
    const prompt = new Confirm(confirmText);

    const answer = await prompt.run();
    assert_internal([true, false].includes(answer));

    console.log();

    if( answer ) {
        loadingSpinner.start({text: 'Deploying'});

        await git.push({cwd, remote: 'origin', branch});

        const commits = await git.log({cwd, args: ['--max-count=2']});
        const isNew = commits.all.length===1;

        loadingSpinner.stop();

        console.log(symbolSuccess+'Deployed.');
        console.log(indent+'(Commit '+colorEmphasisLight(commitHash)+' pushed.)');
        console.log();
    } else {
        console.log(colorError("Not deployed.")+" (Commit not pushed.)");
        console.log();
    }
}

function writeReadme({cwd}) {
    const fs = require("fs");
    const path = require("path");

    const filePath = path.resolve(cwd, './readme.md');
    const fileContent = "App written and deployed with [Reframe](https://github.com/reframejs/reframe)."

    fs.writeFileSync(filePath, fileContent);
}
