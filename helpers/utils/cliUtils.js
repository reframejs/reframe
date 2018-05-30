const pathModule = require('path');
const assert_internal = require('reassert/internal');
const {colorEmphasis, strDir} = require('@brillout/cli-theme');

module.exports = {getProjectRootLog, getRootPluginsLog};

function getProjectRootLog(reframeConfig, emphasize=colorEmphasis) {
    const {projectRootDir} = reframeConfig.projectFiles;

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

function getRootPluginsLog(reframeConfig, emphasize=colorEmphasis) {
    const {$getPluginList} = reframeConfig;
    const rootPluginNames = (
        $getPluginList()
        .filter(plugin => plugin.$isRootPlugin)
        .map(plugin => plugin.$name)
    );
    if( rootPluginNames.length===0 ) {
        return null;
    }
    const pluginList__str = rootPluginNames.map(s => emphasize(s)).join(', ');
    return 'plugin'+(rootPluginNames.length===1?'':'s')+' '+pluginList__str;
}
