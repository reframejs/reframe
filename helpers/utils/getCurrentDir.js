const path_module = require('path');
const callsites = require('callsites');

module.exports = getCurrentDir;
module.exports.currentDir = null;

function getCurrentDir() {
    if( module.exports.currentDir !== null ) {
        return module.exports.currentDir;
    }
    const stacks = callsites();
    for(let i = stacks.length-1; i>=0; i--) {
        const stack = stacks[i];
        if( stack.isNative() ) {
            continue;
        }
        const filePath = stack.getFileName();
        if( isNode(filePath) ) {
            continue;
        }
        if( ! isDependency(filePath) ) {
            return path_module.dirname(filePath);
        }
        break;
    }
    return process.cwd();
}

function isNode(filePath) {
    return !path_module.isAbsolute(filePath);
}
function isDependency(filePath) {
    return filePath.split(path_module.sep).includes('node_modules');
}
