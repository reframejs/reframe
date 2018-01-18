const assert = require('reassert');
const assert_internal = assert;
const log = require('reassert/log');
const build = require('@reframe/build');

const Repage = require('@repage/core');
const {getPageHtml} = require('@repage/server');

const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');

const path = require('path');
const express = require('express');

const pagesDir = path.resolve(__dirname, '../pages');

const app = express();

let pages;

const onBuild = (
    async args => {
        assert_internal(args.pages);
        /*
        log(args);
        log(Object.keys(args));
        */
        pages = args.pages;
    }
);

app.get('*', async function(req, res, next) {
    const {url} = req;
    const html = await renderPageToHtml(url, pages);

    if( ! html ) {
        next();
        return;
    }
    res.send(html);
});

(async () => {
    const {browserDistPath} = await build({
        pagesDir,
        onBuild,
    });

    app.use(express.static(browserDistPath));

    app.listen(3000, function () {
        console.log('App listening on port 3000');
    });
})();


async function renderPageToHtml(uri, pages) {
    const repage = createRepageObject(pages);

    const {html} = await getPageHtml(repage, uri, {canBeNull: true});

    return html;
}

function createRepageObject(pages) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
    ]);

    repage.addPages(pages);

    return repage;
}
