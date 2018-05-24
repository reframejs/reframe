module.exports = deployStatic;

function deployStatic() {
    return {
        name: require('./package.json').name,
        cliCommands: [
            {
                name: 'deploy-static',
                description: 'Deploy HTML-static app to GitHub Pages.',
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

    const projectConfig = getProjectConfig();
    const buildInfo = require(projectConfig.build.getBuildInfo)();
    const {staticAssetsDir, buildEnv, pageConfigs} = buildInfo;

    console.log(buildInfo);

    assert_usage(
        pageConfigs
        .every(pageConfig => pageConfig.htmlStatic),
        "TODO"
    );

    assert_usage(
        buildEnv === 'production',
        "You are trying to deploy a ",
        "The build TODO"
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

    const remote = 'git@github.com:brillout/reframe-github-pages-test';
    const branch = 'master';

    await git.fetch({cwd, remote, branch});

    await git.reset({cwd, options: ['FETCH_HEAD']});

 // TOOD get build timestamp
    await git.commit({cwd, message: 'Built at TODO'});

    await git.push({cwd, remote, branch});
}
