const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

const matchPath = require('react-router/matchPath').default;

module.exports = {
    name: require('./package.json').name,
    isAllowedInBrowser: true,
    pageMixin: {
        routeObject: {
            doesMatchUrl,
            getRouteArguments,
            getRouteUri,
         // hasOnlyOneUniqueRoute,
         // getRouteString,
        },
    },
};

function doesMatchUrl(url, pageInfo) {
    const match_info = get_match_info(url, pageInfo);
    return !!match_info;
    if( ! match_info ) {
        return false;
    }
}

function getRouteArguments(url, pageInfo) {
    const match_info = get_match_info(url, pageInfo);
    if( ! match_info ) {
        return null;
    }
    const params = {match_info};
    assert_internal(params && params.constructor === Object, params);
    return match_info.params;
}

function getRouteUri(routeArguments, pageInfo) {
    assert_usage(
        routeArguments && routeArguments.constructor===Object && Object.keys(routeArguments).length===0,
        "`getRouteUri` not supported for parameterized routes."
    );
    return pageInfo.route;
}

function get_match_info(url, pageInfo) {
    const route = pageInfo && pageInfo.route;
    if( ! route ) {
        return null;
    }
    assert_usage([String, Object].includes(route.constructor));
    const options = (
        route.constructor===String ? (
            {path: route, exact: true}
        ) : (
            Object.assign({exact: true}, route)
        )
    );
    assert_url(url);
    const {pathname} = url;
    return matchPath(pathname, options);
}

function assert_url(url) {
    assert_internal(url && url.constructor===Object, url);
    assert_internal(url.pathname && url.pathname.constructor===String && url.pathname.startsWith('/'), url);
}
