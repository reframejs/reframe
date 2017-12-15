process.on('unhandledRejection', err => {throw err});
require('source-map-support').install();

const assert = require('reassert');
const assert_internal = assert;
const log = require('reassert/log');
const webpackConfig = require('./webpack.config');
const serve = require('@rebuild/serve');
const dir = require('node-dir');
const path_module = require('path');

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


async function serveBrowserAssets(opts) {
    const pages_dir_path = path_module.join(__dirname, '../../easy/pages');

    let page_files = await dir.promiseFiles(pages_dir_path);

    const browserEntries = {};
    const serverEntries = {};
    page_files
    .forEach(path => {
     // const page_name = path_module.basename(path).split('.').slice(0, -1).join('.');
        const entry_name = path_module.basename(path);
        if( path.endsWith('.entry.js') ) {
            browserEntries[entry_name] = [path];
        }
        if( path.endsWith('.html.js') ) {
            serverEntries[entry_name] = [path];
        }
    });

    const webpack_config = webpackConfig({browserEntries, serverEntries});

    serve(webpack_config, {
        log: true,
        doNotCreateServer: true,
        doNotGenerateIndexHtml: true,
        ...opts,
        onBuild: async args => {
            if( ! opts.onBuild ) {
                return;
            }
            opts.onBuild(
                await onBuild(args)
            );
        },
    });
}

async function onBuild(args) {
    const pages_name = await get_pages_name();

    const {compilationInfo, isFirstBuild} = args;
 // const [args_server, args_browser] = compilationInfo;
    const [args_browser, args_server] = compilationInfo;
    assert_internal(args_server);
    assert_internal(args_browser);
 // log(args_server.output);
 // log(args_browser.output);
    const pages = await get_page_infos({args_browser, args_server, pages_name});

    const {htmlBuilder} = args_browser;
    assert_internal(htmlBuilder);
    await writeHtmlStaticPages({htmlBuilder, pages});

    const {HapiServeBrowserAssets} = args_browser;
    assert_internal(HapiServeBrowserAssets, args_server, args_browser);
    return {pages, HapiServeBrowserAssets, isFirstBuild};
}

async function get_pages_name() {
    const pages_dir_path = path_module.join(__dirname, '../../easy/pages');
    let pages_name = await dir.promiseFiles(pages_dir_path);
    pages_name = pages_name.map(path => path_module.basename(path))
    pages_name = (
        pages_name
        .map(filename =>
            filename.endsWith('.js') ?
                filename.slice(0, -('.js'.length)) :
                null
        )
        .filter(Boolean)
    );
    pages_name = pages_name.filter(page_name => /^[a-zA-Z0-9]/.test(page_name) && ! page_name.endsWith('Mixin'));
    return pages_name;
}

async function writeHtmlStaticPages({pages, htmlBuilder}) {
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
        assert_internal(html);
        assert_internal(url.pathname.startsWith('/'));
        assert_internal(url.search==='');
        assert_internal(url.hash==='');
        htmlBuilder({pathname: url.pathname, html});
    });
}

function get_page_infos({args_browser, args_server, pages_name}) {
    const page_infos = (
        Object.values(args_server.output.entry_points)
        .map(entry_point => {
            assert_internal(entry_point.all_assets.length===1, args_server.output);
            const {filepath} = entry_point.all_assets[0];
            assert_internal(filepath);
            return require(filepath);
        })
    );
    return page_infos;
}
/*
function getPages({args_browser, args_server, pages_name}) {
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
    let pages = require(pagesPath)(pages_name);
  //let pages = require('../pages');
    assert_internal(pages && pages.constructor===Array, output_server, pagesPath, pagesPathOriginal, pages);

    const scripts = (
        [
         // {code: 'window.__INTERNAL_DONT_USE__PAGES = '+JSON.stringify(pages_name)+';'},
         // ...output_browser.entry_points['main'].scripts,
        ]
    );

    const styles = output_browser.entry_points['main'].styles;
    pages = pages.map(page =>
        page.isMixin ? page : ({
            scripts: page.renderToDom===null ? [] : scripts,
            styles,
            ...page
        })
    );

    return pages;
}
*/
