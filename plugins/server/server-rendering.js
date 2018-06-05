// TODO move
const {compute_file_hash} = require('@reframe/utils/compute_file_hash');

const assert_internal = require('reassert/internal');
const getPageHtml = require('@brillout/repage/getPageHtml');
const reconfig = require('@brillout/reconfig');

module.exports = serverRendering;

async function serverRendering({url}) {
    const html = await getHtml(url.url);

    if( html === null ) {
        return null;
    }

    const headers = [];

    const hash = compute_file_hash(html);

    headers.push({name: 'content-type', value: 'text/html'});
    headers.push({name: 'etag', value: '"'+hash+'"'});

    return {
        body: html,
        headers,
    }
}

async function getHtml(uri) {
    assert_internal(uri && uri.constructor===String, uri);

    const config = reconfig.getConfig({configFileName: 'reframe.config.js'});

    const {pageConfigs} = config.getBuildInfo();
    const {renderToHtml, router} = config;

    const html = await getPageHtml({pageConfigs, uri, renderToHtml, router});

    return html;
}
