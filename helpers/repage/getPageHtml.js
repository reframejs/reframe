const assert_warning = require('reassert/warning');
const {getUrl} = require('./common/getUrl');
const {renderPageHtml} = require('./common/renderPageHtml');

module.exports = getPageHtml;

async function getPageHtml({pageConfigs, uri, renderToHtml, router, requestContext}) {
    const url = getUrl({uri});

    const pageConfigMatches = (
        pageConfigs
        .filter(pageConfig => router.doesMatchUrl(url, pageConfig))
    );

    if( pageConfigMatches.length===0 ) {
        return null;
    }

    const pageConfig = pageConfigMatches[0];

    assert_warning(
        !pageConfig.renderHtmlAtBuildTime,
        'Performance warning; dynamically rendering a static page at `'+uri+'`.'
    );

    const html = await renderPageHtml({renderToHtml, pageConfig, url, router, requestContext});

    return html;
}
