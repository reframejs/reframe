const assert = require('reassert');
const log = require('reassert/log');
const webpackConfig = require('./webpack.config');
const serve = require('@rebuild/serve');
const isCli = require.main === module;
if( isCli ) {
    serveBrowserAssets();
} else {
    module.exports = {serveBrowserAssets};
}


async function serveBrowserAssets(opts) {
    const args = await serve(webpackConfig, {
        log: true,
        ...opts,
        onBuild: args => {
            if( ! opts.onBuild ) {
                return;
            }
            opts.onBuild(getReturnValue(args));
        },
    });

    return getReturnValue(args);
}

function getReturnValue(args) {
    const {output} = args;
    assert(output, args);
    const pages = getPages(output);
    return {pages, ...args};
}

function getPages(output) {
    assert(output.entry_points.pages.all_assets.length===1, output);
    const pagesEntry = output.entry_points.pages.all_assets[0];
    const {filepath: pagesPath} = pagesEntry;
    assert(pagesPath, output);
    assert(pagesEntry.source_entry_points.length===1, output);
    assert(pagesEntry.source_entry_points[0]===require.resolve('../pages'), output);

  //let pages = require('../pages');
    let pages = require(pagesPath);

    const scripts = output.entry_points['main'].scripts;
    const styles = output.entry_points['main'].styles;
    pages = pages.map(page => ({scripts, styles,...page}));
    return pages;
}
