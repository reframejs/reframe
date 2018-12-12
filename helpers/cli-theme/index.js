const chalk = require('chalk');

const symbols = getSymbols();

const cliTheme = {
    /*
    colorDir: chalk.green,
    colorFile: chalk.green,
    */
    colorDir: chalk.cyan,
    colorFile: chalk.cyan,

    colorEmphasis: chalk.cyan,
    colorEmphasisLight: chalk.bold.white,
    colorCmd: chalk.cyan,
    colorPkg: chalk.cyan,
    colorUrl: chalk.cyan,

    colorError: chalk.bold.red,
    colorWarning: chalk.yellow,

    colorDim: chalk.dim,

    symbolSuccess: chalk.cyan(' '+symbols.success+' '),
    symbolError: chalk.red(' '+symbols.error+' '),
    symbolInfo: chalk.blue(' '+symbols.info+' '),
    symbolWarning: chalk.yellow(' '+symbols.warning+' '),

    indent: '   ',

    strDir: dirPath => {
        const path = require('path');
        dirPath = dirPath + (dirPath.endsWith(path.sep) ? '' : path.sep)
        return cliTheme.strFile(dirPath);
    },
    strDir_emphasisFile: dirPath => {
        const path = require('path');
        const parts = dirPath.split(path.sep);
        const dirStr = cliTheme.strDir(parts.slice(0, -1).join(path.sep));
        return dirStr + cliTheme.colorEmphasis(parts.slice(-1));
    },
    strFile: filePath => {
        const relativeToHomedir = require('@brillout/relative-to-homedir');
        return relativeToHomedir(filePath);
    },
    loadingSpinner: LoadingSpinner(),
    LoadingSpinner,
};

module.exports = cliTheme;

function LoadingSpinner(oraOptions) {
  let currentLoadingSpinner = null;

  return {
    start: startLoadingSpinner,
    stop: stopLoadingSpinner,
    changeText: changeLoadingSpinnerText,
  };

  function startLoadingSpinner({text}={}) {
    const ora = require('ora');
    const assert_usage = require('reassert/usage');

    /*
    assert_usage(
        currentLoadingSpinner===null,
        "Trying to start the loading spinner but it already started"
    );
    */

    if( currentLoadingSpinner ) {
        return;
    }

    const oraOpts = {};
    if( text ) {
        oraOpts.text = text;
    }

    currentLoadingSpinner = ora({...oraOpts, ...oraOptions});

    currentLoadingSpinner.spinner = {frames: currentLoadingSpinner.spinner.frames.map(frame => ' '+frame)};

    currentLoadingSpinner.start();
  }

  function stopLoadingSpinner() {
    const assert_usage = require('reassert/usage');

    /*
    assert_usage(
        currentLoadingSpinner,
        "Trying to end the loading spinner but it hasn't started"
    );
    */

    if( ! currentLoadingSpinner ) {
        return;
    }

    currentLoadingSpinner.stop();

    currentLoadingSpinner = null;
  }

  function changeLoadingSpinnerText(newText) {
    if( ! currentLoadingSpinner ) {
        return;
    }
    currentLoadingSpinner.text = newText;
  }
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
