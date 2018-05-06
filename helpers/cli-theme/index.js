const chalk = require('chalk');
const relativeToHomedir = require('@brillout/relative-to-homedir');
const path = require('path');

const symbols = getSymbols();

const cliTheme = {
    /*
    colorDir: chalk.green,
    colorFile: chalk.green,
    */
    colorDir: chalk.cyan,
    colorFile: chalk.cyan,

    colorEmphasis: chalk.cyan,
    colorEmphasisLight: chalk.bold,
    colorCmd: chalk.cyan,
    colorPkg: chalk.cyan,
    colorUrl: chalk.cyan,

    colorError: chalk.bold.red,
    colorWarning: chalk.yellow,

    colorDim: chalk.dim,

    symbolSuccess: chalk.cyan(' '+symbols.success+' '),
    symbolError: chalk.red(' '+symbols.error+' '),

    indent: '   ',

    strDir: dirPath => {
        dirPath = dirPath + (dirPath.endsWith(path.sep) ? '' : path.sep)
        return cliTheme.strFile(dirPath);
    },
    strFile: filePath => relativeToHomedir(filePath),
    strTable,
};

module.exports = cliTheme;

function strTable(rows, {padding=2, indent}) {
    const columnWidths = [];

    rows.forEach(cells => {
        cells.forEach((cell, columnNumber) => {
            columnWidths[columnNumber] = (
                Math.max(
                    cell.length,
                    columnWidths[columnNumber]||0
                )
            );
        });
    });

    const lines = [];

    rows.forEach(cells => {
        let line = indent;
        cells.forEach((cell, columnNumber) => {
            const colWidth = columnWidths[columnNumber];
            let cellStr = new Array(colWidth+padding).fill(' ').join('');
            cellStr = cell + cellStr.slice(cell.length);
            line += cellStr;
        });
        lines.push(line);
    });

    return lines.join('\n');
}

// Copied and adapted from https://www.npmjs.com/package/log-symbols
function getSymbols() {
    const isSupported = process.platform !== 'win32' || process.env.CI || process.env.TERM === 'xterm-256color';

    const main = {
        info: 'ℹ',
        success: '✔',
        warning: '⚠',
        error: '✖',
    };

    const fallbacks = {
        info: 'i',
        success: '√',
        warning: '‼',
        error: '×',
    };

    return isSupported ? main : fallbacks;
}
