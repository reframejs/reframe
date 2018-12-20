const assert_internal = require('reassert/internal');
const crypto = require('crypto');
const getPageHtml = require('@brillout/repage/getPageHtml');
const reconfig = require('@brillout/reconfig');

module.exports = ServerRendering;

// We set a low priority for the universal adapters
ServerRendering.executionPriority = -1000;

async function ServerRendering(requestContext) {
    const html = await getHtml(requestContext);

    if( html === null ) {
        return null;
    }

    const headers = [];
    headers.push({name: 'Content-Type', value: 'text/html'});
    headers.push({name: 'ETag', value: '"'+computeHash(html)+'"'});

    return {
        body: html,
        headers,
    }
}

async function getHtml(requestContext) {
    const uri = requestContext.url;
    assert_internal(uri && uri.constructor===String, uri);

    const config = reconfig.getConfig({configFileName: 'reframe.config.js'});

    const {pageConfigs} = config.getBuildInfo();
    const {renderToHtml, router} = config;

    const html = await getPageHtml({pageConfigs, uri, renderToHtml, router, requestContext});
    assert_internal(html===null || html.constructor===String, html);

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
