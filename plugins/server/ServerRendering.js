const assert_internal = require('reassert/internal');
const crypto = require('crypto');
const getPageHtml = require('@brillout/repage/getPageHtml');
const reconfig = require('@brillout/reconfig');

module.exports = serverRendering;

async function serverRendering({url}) {
    const html = await getHtml(url.uri);

    if( html === null ) {
        return null;
    }

    const hash = computeHash(html);

    const headers = [];
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
    assert_internal(html.constructor===String, html);

    return html;
}

function computeHash(str) {
    return (
        crypto
        .createHash('md5')
        .update(str, 'utf8')
        .digest('base64')
        .replace(/=+$/, '')
    );
}
