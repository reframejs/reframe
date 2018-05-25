module.exports = deployStatic;

const cmdDescription = 'Deploy to GitHub Pages.';

function deployStatic() {
    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'deploy-static',
                description: cmdDescription,
                action: runDeploy,
            }
        ],
    };
}

async function runDeploy() {
    console.log();
    console.log(cmdDescription);
    console.log();

    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const path = require("path");
    const git = require('@reframe/utils/git');
    const assert_usage = require('reassert/usage');
    const assert_internal = require('reassert/internal');
    const Confirm = require('prompt-confirm');
    const GitUrlParse = require("git-url-parse");
    const {colorError, colorEmphasis, strDir, loadingSpinner, symbolSuccess, indent} = require('@brillout/cli-theme');

    const projectConfig = getProjectConfig();
    const {projectRootDir} = projectConfig.projectFiles;
    assert_internal(projectRootDir);

    assert_usage(
        projectConfig.build.getBuildInfo
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
        "To statically deploy to GitHub Pages, all your page configs need to have `htmlStatic` set to `true`.",
        "But the following pages aren't:",
        htmlDynamicPages
        .map(pageConfig => {
            return "  "+pageConfig.pageName+" ("+pageConfig.pageFile+")";
        })
        .join('\n')
    );

    const {githubPagesRepository} = projectConfig;
    assert_usage(
        githubPagesRepository && githubPagesRepository.remote,
        "Config `githubPagesRepository.remote` missing.",
        "",
        "Create a new GitHub repository at https://github.com/new",
        "",
        "Then add the repository's address to "+colorEmphasis("githubPagesRepository.remote")+" in your "+colorEmphasis(path.resolve(projectRootDir, "./reframe.config.js"))+".",
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

    const repoInfo = GitUrlParse(remote);
    assert_usage(
        repoInfo.source==='github.com',
        "The repository `"+remote+"` isn't a GitHub repository but it should be."
    );

    const repoShort = 'github:'+repoInfo.owner+'/'+repoInfo.name;
    const githubPageUrl__without_protocol = (
        repoInfo.owner+'.github.io' +
        (repoInfo.name === repoInfo.owner+'.github.io' ? '' : ('/'+repoInfo.name))
    );
    const githubPageUrl = 'https://'+githubPageUrl__without_protocol;

    const remoteText = ' '+colorEmphasis(branch)+' of '+colorEmphasis(repoShort);
    const loadingText = remoteText;
    loadingSpinner.start({text: 'Loading'+loadingText});

    await git.addRemote({cwd, remote, name: 'origin'});

    await git.fetch({cwd, remote: 'origin', branch});

    await git.reset({cwd, args: ['FETCH_HEAD']});

    await git.branch({cwd, args: ['-u', 'origin/'+branch]});

    const readmePath = await git.checkoutReadme({cwd});
    if( ! readmePath ) {
        writeReadme({cwd, githubPageUrl, githubPageUrl__without_protocol});
    }

    loadingSpinner.stop();
    console.log(symbolSuccess+'Loaded'+loadingText+' at '+colorEmphasis(strDir(cwd)));
    console.log();

    const {commit: commitHash} = await git.commit({cwd, message: 'Built at '+buildTime.toString()});

    if( ! commitHash ) {
        console.log(symbolSuccess+"App already deployed. App live at "+githubPageUrl);
        console.log();
        return
    }

    const commitInfo = await git.show({cwd, args: [commitHash, '--name-only']});

    console.log(symbolSuccess+'New commit:');
    console.log();
    console.log(commitInfo);

    const confirmText = 'Deploy app? (By pushing commit '+colorEmphasis(commitHash)+' to'+remoteText+'.)';
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

        console.log(symbolSuccess+'App deployed.');
        console.log(indent+'(Commit '+colorEmphasis(commitHash)+' pushed.)');
        console.log(indent+'App live at '+githubPageUrl);
        // Source: https://stackoverflow.com/questions/24851824/how-long-does-it-take-for-github-page-to-show-changes-after-changing-index-html
        console.log(indent+'(It can take GitHub Pages a while to update your app. For newly created apps it can take up to ~10 minutes.)');
        console.log();
    } else {
        console.log(colorError("App not deployed.")+" (Commit not pushed.)");
        console.log();
    }
}

function writeReadme({cwd, githubPageUrl, githubPageUrl__without_protocol}) {
    const fs = require("fs");
    const path = require("path");

    const filePath = path.resolve(cwd, './readme.md');
    const fileContent = (
`Source code of [${githubPageUrl__without_protocol}](${githubPageUrl}).

Written with [Reframe](https://github.com/reframejs/reframe) and
deployed with [@reframe/github-pages](https://github.com/reframejs/reframe/tree/master/plugins/github-pages).
`
    );

    fs.writeFileSync(filePath, fileContent);
}
