import buildScript from './build-script.mjs';
import buildHtml from './build-html.mjs';
import expose from './expose.js';
import getPages from './get-pages.mjs';

process.on('unhandledRejection', err => {throw err});

export default build;

async function build() {
    const browserDistPath = getBrowserDistPath;

    await buildScript({browserDistPath});
    await buildHtml({browserDistPath});

    const pages = getPages();

    return {
        browserDistPath,
        pages,
    };
}

function getBrowserDistPath() {
    const {__dirname} = expose;
    const browserDistPath = __dirname+'/dist';
    return browserDistPath;
}
