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

    const projectConfig = getProjectConfig();
    const buildInfo = require(projectConfig.build.getBuildInfo)({requireProductionBuild: true});
    const {staticAssetsDir, buildEnv, pageConfigs, buildTime} = buildInfo;
    assert_internal(buildEnv==='production');
    assert_internal(buildTime);

    console.log(buildInfo);

    const htmlDynamicPages = (
        pageConfigs
        .filter(pageConfig => !pageConfig.htmlStatic)
    );
    assert_usage(
        htmlDynamicPages.length===0,
        "TODO"
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

    await git.reset({cwd, args: ['FETCH_HEAD']});

    const readmePath = await git.checkoutReadme({cwd});
    if( ! readmePath ) {
        writeReadme({cwd});
    }

 // TOOD get build timestamp
    await git.commit({cwd, message: 'Built at '+buildTime.toString()});

 // await git.push({cwd, remote, branch});
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
