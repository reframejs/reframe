const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;
const parseUri = require('@atto/parse-uri');

module.exports = getPageHtml;

async function getPageHtml(repage, uri, {canBeNull=false, dontRenderHtmlStatic=false}={}) {
    assert_usage(
        repage && repage.isRepageObject && uri,
        "Wrong arguments"
    );

    const url = parseUri(uri);
    const pageInfo = repage.getMatchingPageHandler({url, canBeNull, isRunningInBrowser: false});

    const ret = {html: null, renderToHtmlIsMissing: false};

    if( pageInfo === null ) {
        assert_internal(canBeNull===true);
        return ret;
    }

    if( dontRenderHtmlStatic && pageInfo.htmlStatic ) {
        return ret;
    }

    if( pageInfo.htmlStatic ) {
        console.warn('Performance warning; dynamically rendering a page for `'+uri+'` that is static.')
    }

    const routeArguments = pageInfo.routeObject.getRouteArguments(url, pageInfo);
    assert_internal(routeArguments && routeArguments.constructor===Object, pageInfo, url);

    if( pageInfo.renderToHtml ) {
        ret.html = await pageInfo.renderToHtml({page: pageInfo, route: {args: routeArguments, url}, isStaticRendering: false});
    } else {
        ret.renderToHtmlIsMissing = true;
    }

    return ret;
}
