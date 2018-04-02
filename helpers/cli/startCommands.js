const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');

module.exports = startCommands;

function startCommands() {
    return {
        name: require('./package.json').name+__filename.slice(__dirname.length + 1, -3),
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
                action: async options => {
                    const projectConfig = getProjectConfig();
                    /*
                    const {startBuild} = projectConfig.projectFiles;
                    if( startBuild ) {
                        await startBuild();
                    }
                    */
                 // start(options.production, options.log);
                    const buildState = await startBuild();
                    startServer(buildState);
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

async function startBuild() {
    const projectConfig = getProjectConfig();
    const {projectRootDir} = projectConfig.projectFiles;

    const build = require(resolvePackagePath('@reframe/build'));
    const build_state = {};
    await build({
        onBuild: async build_state__new => {
            /*
            assert_internal(build_state__new.browserDistPath, build_state__new);
            assert_internal(build_state__new.pages, build_state__new);
            assert_usage(
                !build_state.browserDistPath || build_state.browserDistPath===build_state__new.browserDistPath,
                "The directory holding the static assets isn't expected to move.",
                "Yet it is moving from `"+build_state.browserDistPath+"` to `"+build_state__new.browserDistPath+"`."
            );
            */
            Object.assign(build_state, build_state__new);
        },
    });
    assert_internal(build_state.pages);
    return build_state;
}

function startServer(buildState) {
    const server = require(resolvePackagePath('@reframe/server'));
    return server(buildState);
}
