// TODO rename to find-project-files

const pathModule = require('path');
const findProjectFiles = require('@reframe/utils/findProjectFiles');
const getPageConfigFiles = require('@reframe/utils/getPageConfigFiles');

let projectFiles;

module.exports = {
    $name: require('./package.json').name,
    $getters: [
        {
            prop: 'projectFiles',
            getter: () => getProjectFiles(),
        },
        {
            prop: 'getPageConfigFiles',
            getter: () => () => {
                const {pagesDir} = getProjectFiles();
                return getPageConfigFiles({pagesDir});
            },
        },
    ],
};

function getProjectFiles() {
    if( ! projectFiles ) {
        const {reframeConfigFile, pagesDir, projectRootDir, packageJsonFile} = findProjectFiles({projectNotRequired: true});

        const buildOutputDir = projectRootDir && pathModule.resolve(projectRootDir, './dist');

        projectFiles = {
            reframeConfigFile,
            packageJsonFile,
            pagesDir,
            projectRootDir,
            buildOutputDir,
        };
    }

    return projectFiles;
}

