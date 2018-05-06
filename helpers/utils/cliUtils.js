const pathModule = require('path');
const assert_internal = require('reassert/internal');
const {colorEmphasis, strDir} = require('@brillout/cli-theme');

module.exports = {getProjectRootLog, getRootPluginsLog};

function getProjectRootLog(projectConfig, emphasize=colorEmphasis) {
    const {projectRootDir} = projectConfig.projectFiles;

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

function getRootPluginsLog(projectConfig, emphasize=colorEmphasis) {
    const {_rootPluginNames} = projectConfig;
    if( _rootPluginNames.length===0 ) {
        return null;
    }
    const pluginList__str = _rootPluginNames.map(s => emphasize(s)).join(', ');
    return 'plugin'+(_rootPluginNames.length===1?'':'s')+' '+pluginList__str;
}
