const assert = require('reassert');
const assert_internal = assert;
const getCurrentDir = require('@reframe/utils/getCurrentDir');
const getProjectConfig = require('@reframe/utils/getProjectConfig');

module.exports = {find_app_files};

function find_app_files(cwd) {
    assert_internal(cwd);
    getCurrentDir.currentDir = cwd;

    const projectConfig = getProjectConfig();
    assert_internal(projectConfig);

    const {pagesDir, projectRootDir, reframeConfigPath} = projectConfig.getProjectFiles();

    return {reframeConfigPath, pagesDirPath: pagesDir, appDirPath: projectRootDir};
}

