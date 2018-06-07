const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');
const find_up = require('find-up');
const find = require('./find');
const getUserDir = require('@brillout/get-user-dir');

module.exports = findProjectFiles;

// TODO - move to find-project-files plugin
function findProjectFiles({projectNotRequired}) {
    assert_internal([true, false].includes(projectNotRequired));

    const userDir = getUserDir();
 // console.log(require.resolve('@brillout/get-user-dir'));
    assert_internal(userDir);

    const packageJsonFile = find_up.sync('package.json', {cwd: userDir});
    assert_internal(packageJsonFile===null || pathModule.isAbsolute(packageJsonFile));

    const reframeConfigFile = find_up.sync('reframe.config.js', {cwd: userDir});
    assert_internal(reframeConfigFile===null || pathModule.isAbsolute(reframeConfigFile));

    if( projectNotRequired && (!packageJsonFile || !reframeConfigFile) ) {
        return {};
    }

    assert_usage(
        packageJsonFile,
        "Can't find project because no `package.json` file has been found between `"+userDir+"` and `/`."
    );
    assert_usage(
        reframeConfigFile,
        "Can't find project because no `reframe.config.js` file has been found between `"+userDir+"` and `/`."
    );

    assert_usage(
        pathModule.dirname(packageJsonFile)===pathModule.dirname(reframeConfigFile),
        "Your `reframe.config.js` and `package.json` should be located in the same directory.",
        "This is not the case: `"+packageJsonFile+"`, `"+reframeConfigFile+"`."
    );

    const projectRootDir = pathModule.dirname(packageJsonFile);

    const pagesDir = find('pages/', {anchorFiles: ['package.json'], canBeMissing: true, cwd: userDir});
    assert_internal(pagesDir===null || pathModule.isAbsolute(pagesDir));

    return {packageJsonFile, reframeConfigFile, pagesDir, projectRootDir};
}
