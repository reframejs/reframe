const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const assert_todo = assert_internal;

// `matchPath` source code:
//    https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/matchPath.js
const reactRouter = require('react-router');
const {matchPath} = reactRouter||{};
assert_internal(matchPath, {matchPath, reactRouter});

const router = {
    doesMatchUrl,
    getRouteArguments,
    getRouteUri,
 // hasOnlyOneUniqueRoute,
 // getRouteString,
};

module.exports = router;

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

function hasOnlyOneUniqueRoute() {
    assert_todo(false);
    // Will be possible with pathToRegexp.parse('/route/:foo/(.*)')
    //  - https://github.com/pillarjs/path-to-regexp#parse
    //  - Is availble for path-to-regexp@2 but react-router is using path-to-regexp@^1.7.0
    //    - See https://github.com/ReactTraining/react-router/blob/master/packages/react-router/package.json
}

function getRouteString() {
    assert_todo(false);
    // Should be possible with pathToRegexp.compile('/user/:id')
    //  - https://github.com/pillarjs/path-to-regexp#compile-reverse-path-to-regexp
    //  - available at path-to-regexp@^1.7.0 ?
}
