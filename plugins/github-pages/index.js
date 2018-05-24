module.exports = deployStatic;

function deployStatic() {
    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'deploy-static',
                description: 'Deploy to GitHub Pages.',
                action: async () => {
                    runDeploy();
                },
            }
        ],
    };
}

async function runDeploy() {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const git = require('@reframe/utils/git');
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const Confirm = require('prompt-confirm');
    const {colorError, colorEmphasis, strDir, loadingSpinner, symbolSuccess} = require('@brillout/cli-theme');

    const projectConfig = getProjectConfig();

    const {githubPagesRepository} = projectConfig;
    assert_usage(
        githubPagesRepository && githubPagesRepository.remote,
        "You need to defined the `githubPagesRepository.remote` option in your `reframe.config.js`",
        "",
        "Example: ",
        (
`
// reframe.config.js

module.exports = {
    githubPagesRepository: {
        remote: 'git@github.com:username/repo',
        branch: 'master', // optional, default is \`master\`
    },
};
`
        )

    );

    const buildInfo = require(projectConfig.build.getBuildInfo)({requireProductionBuild: true});
    const {staticAssetsDir, buildEnv, pageConfigs, buildTime} = buildInfo;
    assert_internal(buildEnv==='production');
    assert_internal(buildTime);

    const htmlDynamicPages = (
        pageConfigs
        .filter(pageConfig => !pageConfig.htmlStatic)
    );
    assert_usage(
        htmlDynamicPages.length===0,
        "To be able to statically deploy to GitHub Pages, all your page configs need to have `htmlStatic: true`.",
        "But the following pages don't have `htmlStatic: true`:",
        htmlDynamicPages
        .map(pageConfig => {
            console.log(pageConfig);
            return "  "+pageConfig.pageName+" ("+pageConfig.pageFile+")";
        })
        .join('\n')
    );

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

    const {remote, branch='master'} = githubPagesRepository;

    const remoteText = ' '+colorEmphasis(branch)+' of '+colorEmphasis(remote);
    const loadingText = remoteText;
    loadingSpinner.start({text: 'Loading'+loadingText});

    await git.fetch({cwd, remote, branch});

    await git.reset({cwd, args: ['FETCH_HEAD']});

    const readmePath = await git.checkoutReadme({cwd});
    if( ! readmePath ) {
        writeReadme({cwd});
    }

    loadingSpinner.stop();
    console.log(symbolSuccess+'Loaded'+loadingText+' at '+colorEmphasis(strDir(cwd)));
    console.log();

    const {commit: commitHash} = await git.commit({cwd, message: 'Built at '+buildTime.toString()});

    const commitInfo = await git.show({cwd, args: [commitHash, '--name-only']});

    console.log(symbolSuccess+'New commit:');
    console.log();
    console.log(commitInfo);
    console.log();

    const confirmText = 'Deploy app?\n(By pushing commit '+colorEmphasis(commitHash)+' to'+remoteText+'.)\n';
    const prompt = new Confirm(confirmText);

    const answer = await prompt.run();
    assert_internal([true, false].includes(answer));

    console.log();

    if( answer ) {
        loadingSpinner.start({text: 'Deploying'});
        await git.push({cwd, remote, branch});
        loadingSpinner.stop();
        console.log(symbolSuccess+'App deployed. (Commit '+colorEmphasis(commitHash)+' pushed).');
        console.log();
    } else {
        console.log("Commit not pushed.");
        console.log(colorError("App not deployed."));
        console.log();
    }
}

function writeReadme({cwd}) {
    const fs = require("fs");
    const path = require("path");

    const filePath = path.resolve(cwd, './readme.md');
    const fileContent = (
`This website/webapp is
 - Written with Reframe ([github.com/reframejs/reframe](https://github.com/reframejs/reframe)).
 - Deployed with the Reframe plugin [@reframe/github-pages](https://github.com/reframejs/reframe/tree/master/plugins/github-pages).
`
    );

    fs.writeFileSync(filePath, fileContent);
}
