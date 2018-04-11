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
                action,
            }
        ],
    };
}

async function action() {
    const getProjectConfig = require('@reframe/utils/getProjectConfig');
    const relative_to_homedir = require('@brillout/relative-to-homedir');
    const assert_internal = require('reassert/internal');
    const assert_usage = require('reassert/usage');
    const chalk = require('chalk');

    await runStart.apply(null, arguments);

    return;

    async function runStart({production, log}) {
        if( production ) {
            process.env['NODE_ENV'] = 'production';
        }

        const projectConfig = getProjectConfig();

        log_found_file(projectConfig.projectFiles.reframeConfigFile, 'Reframe config');
        log_found_file(projectConfig.projectFiles.pagesDir, 'Pages directory');

        projectConfig.log = {
            verbose: !!log,
        };

        /*
        const build = require(resolvePackagePath('@reframe/build'));
        await build({log});
        */
        await require(resolvePackagePath('@reframe/build', projectConfig.projectFiles.projectRootDir));

        const server = require(resolvePackagePath('@reframe/server', projectConfig.projectFiles.projectRootDir));
        server({log});
    }

    function resolvePackagePath(packageName, projectRootDir) {
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

    function log_found_file(file_path, description) {
        if( file_path ) {
            console.log(green_checkmark()+' '+description+' found at '+relative_to_homedir(file_path));
        }
    }

    function green_checkmark() {
        return chalk.green('\u2714');
    }
}
