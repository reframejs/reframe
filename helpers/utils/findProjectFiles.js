const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');
const find_up = require('find-up');
const find = require('./find');
const getUserDir = require('@brillout/get-user-dir');

module.exports = findProjectFiles;

function findProjectFiles({projectNotRequired}) {
    assert_internal([true, false].includes(projectNotRequired));

    const userDir = getUserDir();
    assert_internal(userDir);

    const packageJsonFile = find_up.sync('package.json', {cwd: userDir});
    assert_internal(packageJsonFile===null || pathModule.isAbsolute(packageJsonFile));

    if( ! packageJsonFile && projectNotRequired ) {
        return {};
    }

    assert_usage(
        packageJsonFile,
        "Can't find project because no `package.json` file has been found between `"+userDir+"` and `/`."
    );

    const projectRootDir = pathModule.dirname(packageJsonFile);

    const pagesDir = find('pages/', {anchorFiles: ['package.json'], canBeMissing: true, cwd: userDir});
    assert_internal(pagesDir===null || pathModule.isAbsolute(pagesDir));

    const reframeConfigFile = find('reframe.config.js', {anchorFiles: ['package.json'], canBeMissing: true, cwd: userDir});
    assert_internal(reframeConfigFile===null || pathModule.isAbsolute(reframeConfigFile));

    return {packageJsonFile, reframeConfigFile, pagesDir, projectRootDir};
}
