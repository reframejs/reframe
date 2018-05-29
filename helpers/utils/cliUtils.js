const pathModule = require('path');
const assert_internal = require('reassert/internal');
const {colorEmphasis, strDir} = require('@brillout/cli-theme');

module.exports = {getProjectRootLog, getRootPluginsLog};

function getProjectRootLog(globalConfig, emphasize=colorEmphasis) {
    const {projectRootDir} = globalConfig.projectFiles;

    if( ! projectRootDir ) {
        return null;
    }

    const dirS = strDir(projectRootDir).split(pathModule.sep);
    const l = dirS.length;
    assert_internal(dirS[l-1]==='');
    assert_internal(dirS[l-2]!=='');

    dirS[l-2] = emphasize(dirS[l-2]);
    const project_root = dirS.slice(0, -1).join(pathModule.sep)+pathModule.sep;

    return 'project '+project_root;
}

function getRootPluginsLog(globalConfig, emphasize=colorEmphasis) {
    const {$pluginNames} = globalConfig;
    if( $pluginNames.length===0 ) {
        return null;
    }
    const pluginList__str = $pluginNames.map(s => emphasize(s)).join(', ');
    return 'plugin'+($pluginNames.length===1?'':'s')+' '+pluginList__str;
}
