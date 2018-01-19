import HelloPage from './pages/hello.html';

import Repage from '@repage/core';
import RepageBuild from '@repage/build';
import RepageRouterCrossroads from '@repage/router-crossroads';
import RepageRenderer from '@repage/renderer';
import RepageRendererReact from '@repage/renderer-react';

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';
import expose from './expose.js';

export default buildHtml;

async function buildHtml() {
    const staticPages = await getStaticPages();
    writeHtml(staticPages);
}

function writeHtml(staticPages) {
    const {__dirname} = expose;
    const diskPathBase = __dirname+'/dist';
    staticPages
    .map(({html, url: {pathname}}) => {
        const diskPath = (
            [
                diskPathBase,
                (pathname==='/' ? '/index' : pathname),
                '.html',
            ].join('')
        );
        return {html, diskPath};
    })
    .forEach(({html, diskPath}) => {
        writeFile(diskPath, html);
    });
}

function writeFile(diskPath, content) {
    mkdirp.sync(path.dirname(diskPath));
    fs.writeFileSync(diskPath, content);
}

function getStaticPages() {
    const pages = (
        [
            HelloPage,
        ]
        .map(pageObject => {
            pageObject.scripts = pageObject.scripts || [];
            pageObject.scripts.push({src: '/bundle.js'});
            return pageObject;
        })
    )

    const repage = getRepageObject(pages);

    return RepageBuild.getStaticPages(repage);
}

function getRepageObject(pages) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
    ]);

    repage.addPages(pages);

    return repage;
}
