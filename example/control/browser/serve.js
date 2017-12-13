process.on('unhandledRejection', err => {throw err});
require('source-map-support').install();

const assert = require('reassert');
const assert_internal = assert;
const log = require('reassert/log');
const webpackConfig = require('./webpack.config');
const serve = require('@rebuild/serve');

const Repage = require('@repage/core/build');
const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');
const RepagePageLoader = require('@repage/page-loader');

const isCli = require.main === module;
if( isCli ) {
    serveBrowserAssets();
} else {
    module.exports = {serveBrowserAssets};
}


function serveBrowserAssets(opts) {
    serve(webpackConfig, {
        log: true,
        doNotCreateServer: true,
        doNotGenerateIndexHtml: true,
        ...opts,
        onBuild: async args => {
            if( ! opts.onBuild ) {
                return;
            }
            opts.onBuild(
                await buildArgsHandler(args)
            );
        },
    });
}

async function buildArgsHandler(args) {
    const {compilationInfo, isFirstBuild} = args;
    const [args_browser, args_server] = compilationInfo;
    const pages = getPages(args_browser, args_server);

    const {htmlBuilder, genericHtml} = args_browser;
    assert_internal(htmlBuilder);
    assert_internal(genericHtml && genericHtml.constructor===String, genericHtml);
    await writeHtmlStaticPages({htmlBuilder, genericHtml, pages});

    const {HapiServeBrowserAssets} = args_browser;
    return {pages, genericHtml, HapiServeBrowserAssets, isFirstBuild};
}

async function writeHtmlStaticPages({pages, htmlBuilder, genericHtml}) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
        RepagePageLoader,
    ]);

    repage.addPages(pages);

    await repage.waitInit();

    const htmlStaticPages = await repage.getStaticPages();

    htmlStaticPages.forEach(({url, html}) => {
        assert_internal(html===null || html && html.constructor===String, html);
        if( ! html ) {
            html = genericHtml;
        }
        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');
        htmlBuilder({pathname: url.pathname, html});
    });
}

function getPages(args_browser, args_server) {
    const {output: output_server} = args_server;
    assert_internal(output_server);
    assert_internal(output_server.entry_points.pages, arguments)
    const {output: output_browser} = args_browser;
    assert_internal(output_browser);
    assert_internal(output_browser.entry_points.main, arguments)

    assert_internal(output_server.entry_points.pages.all_assets.length===1, output_server);

    const pagesEntry = output_server.entry_points.pages.all_assets[0];
    const {filepath: pagesPath} = pagesEntry;
    assert_internal(pagesPath, output_server);
    const pagesPathOriginal = require.resolve('../pages');
    assert_internal(pagesEntry.source_entry_points.includes(pagesPathOriginal), output_server);
    global._babelPolyfill = false;
    let pages = require(pagesPath);
  //let pages = require('../pages');
    assert_internal(pages && pages.constructor===Array, output_server, pagesPath, pagesPathOriginal, pages);

    const scripts = output_browser.entry_points['main'].scripts;
    const styles = output_browser.entry_points['main'].styles;
    pages = pages.map(page =>
        page.isMixin ? page : ({
            scripts: page.renderToDom===null ? undefined : scripts,
            styles,
            ...page
        })
    );

    return pages;
}
