import Repage from '@repage/core';
import RepageBuild from '@repage/build';
import RepageRouterCrossroads from '@repage/router-crossroads';
import RepageRenderer from '@repage/renderer';
import RepageRendererReact from '@repage/renderer-react';

import getPages from './get-pages.mjs';

import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export default buildHtml;

async function buildHtml({browserDistPath}) {
    const staticPages = await getStaticPages();
    writeHtml({staticPages, browserDistPath});
}

function writeHtml({staticPages, browserDistPath}) {
    staticPages
    .map(({html, url: {pathname}}) => {
        const diskPath = (
            [
                browserDistPath,
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
    const pages = getPages();
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
