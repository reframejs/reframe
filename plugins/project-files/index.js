const globalConfig = require('@brillout/global-config');
const findProjectFiles = require('@reframe/utils/findProjectFiles');
const getPageConfigFiles = require('@reframe/utils/getPageConfigFiles');

let projectFiles;

globalConfig.$addGetter({
    prop: 'projectFiles',
    getter: () => getProjectFiles(),
});
globalConfig.$addGetter({
    prop: 'getPageConfigFiles',
    getter: () => () => {
        const {pagesDir} = getProjectFiles();
        return getPageConfigFiles({pagesDir});
    },
});

function getProjectFiles() {
    if( ! cache ) {
        const {reframeConfigFile, pagesDir, projectRootDir, packageJsonFile} = findProjectFiles({projectNotRequired: true});

        const buildOutputDir = projectRootDir && pathModule.resolve(projectRootDir, './dist');

        const projectFiles = {
            reframeConfigFile,
            packageJsonFile,
            pagesDir,
            projectRootDir,
            buildOutputDir,
        };
    }

    return projectFiles;
}

