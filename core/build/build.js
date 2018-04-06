const WebpackSSR = require('webpack-ssr');
const getProjectConfig = require('@reframe/utils/getProjectConfig');
const assert_internal = require('reassert/internal');

const projectConfig = getProjectConfig();
assert_internal(projectConfig);
const {pagesDir, buildOutputDir} = projectConfig.projectFiles;

const buildSSR = new WebpackSSR({
    watchDir: pagesDir,
    outputDir: buildOutputDir,
});

module.exports = buildSSR.build();
