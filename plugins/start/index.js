const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = startCommands;

function startCommands() {
    return {
        name: require('./package.json'),
        cliCommands: [
            {
                name: 'start',
                description: 'starts dev server on localhost',
                options: [
                    {
                        name: "-p, --production",
                        description: "start for production",
                    },
                    {
                        name: "-l, --log",
                        description: "prints build and page information",
                    },
                ],
                action: async ({production, log}) => {
                    if( production ) {
                        process.env['NODE_ENV'] = 'production';
                    }

                    const build = require(resolvePackagePath('@reframe/build'));
                    await build({log});

                    const server = require(resolvePackagePath('@reframe/server'));
                    server({log});
                },
            }
        ],
    };
}

function resolvePackagePath(packageName) {
    const projectConfig = getProjectConfig();
    const {projectRootDir} = projectConfig.projectFiles;
    assert_internal(projectRootDir);

    let packagePath;
    try {
        packagePath = require.resolve(packageName, {paths: [projectRootDir]});
    } catch(err) {
        if( err.code!=='MODULE_NOT_FOUND' ) throw err;
        assert_usage(
            false,
            "Package `"+packageName+"` is missing.",
            "You need to install it: `npm install "+packageName+"`.",
            "Project in question: `"+projectRootDir+"`.",
        );
    }

    assert_internal(packagePath);
    return packagePath;
}
