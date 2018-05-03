const chalk = require('chalk');
const relativeToHomedir = require('@brillout/relative-to-homedir');
const path = require('path');

const cliTheme = {
    /*
    colorDir: chalk.green,
    colorFile: chalk.green,
    */
    colorDir: chalk.cyan,
    colorFile: chalk.cyan,

    colorEmp: chalk.cyan,
    colorCmd: chalk.cyan,
    colorPkg: chalk.cyan,
    colorUrl: chalk.cyan,

    colorErr: chalk.bold.red,

    colorDim: chalk.dim,

    symbolSuccess: chalk.cyan(' \u{2714} '),

    strDir: dirPath => {
        dirPath = dirPath + (dirPath.endsWith(path.sep) ? '' : path.sep)
        return cliTheme.strFile(dirPath);
    },
    strFile: filePath => relativeToHomedir(filePath),
};

module.exports = cliTheme;
