const globalConfig = require('@brillout/global-config');
const findProjectFiles = require('@reframe/utils/findProjectFiles');
const getPageConfigFiles = require('@reframe/utils/getPageConfigFiles');

let cache;

globalConfig.$addGetter({
    prop: 'projectFiles',
    getter: () => {
        if( ! cache ) {
            cache = getProjectFiles();
        }
        return cache;
    }
});

function getProjectFiles() {
    const {reframeConfigFile, pagesDir, projectRootDir, packageJsonFile} = findProjectFiles({projectNotRequired: true});

    const buildOutputDir = projectRootDir && pathModule.resolve(projectRootDir, './dist');

    return {
        reframeConfigFile,
        packageJsonFile,
        pagesDir,
        projectRootDir,
        buildOutputDir,
    };
}

