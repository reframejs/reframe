const chalk = require('chalk');
const relativeToHomedir = require('@brillout/relative-to-homedir');
const pathModule = require('path');

const cliColors = {
    colorDir: chalk.green,
    colorFile: chalk.green,
    colorCmd: chalk.cyan,
    colorPkg: chalk.cyan,
    colorUrl: chalk.cyan,
    colorErr: chalk.bold.red,
    symbolSuccess: chalk.green('\u2714'),
    strDir: dirPath => {
        dirPath = dirPath + (dirPath.endsWith(pathModule.sep) ? '' : pathModule.sep)
        /*
        dirPath = dirPath + (
            pathModule.sep==='/' && !dirPath.endsWith('/') && '/' || ''
        );
        */
        return cliColors.strFile(dirPath);
    },
    strFile: filePath => relativeToHomedir(filePath),
};

module.exports = cliColors;
