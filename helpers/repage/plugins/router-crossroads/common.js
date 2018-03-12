//const assert = require('assert');
const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

// undocumented APIs;
//  - https://github.com/millermedeiros/crossroads.js/blob/master/dev/tests/spec/lexer.spec.js
const crossroads = require('crossroads');

module.exports = {
    name: require('./package.json').name,
    isAllowedInBrowser: true,
    pageMixin: {
        routeObject: {
            doesMatchUrl,
            getRouteArguments,
            hasOnlyOneUniqueRoute,
            getRouteUri,
         // getRouteString,
        },
    },
};

function doesMatchUrl(url, pageInfo) {
    assert_url(url);
    const route_crossroad = get_route_crossroads(pageInfo);

    const ret = route_crossroad.match(url.pathname);
    assert_internal([true, false].includes(ret));
    return ret;
}

function getRouteArguments(url, pageInfo) {
    assert_url(url);
    const route_crossroad = get_route_crossroads(pageInfo, {can_be_null: true});
    if( ! route_crossroad || ! route_crossroad.match(url.pathname) ) {
        return null;
    }
    const routeArguments = route_crossroad._getParamsObject(url.pathname);
    assert_internal(routeArguments.constructor===Object, routeArguments);
    return routeArguments;
}

function hasOnlyOneUniqueRoute(pageInfo) {
    assert_page_info(pageInfo);
    const {route} = pageInfo;
    const paramIds = crossroads.patternLexer.getParamIds(route);
    assert(paramIds.constructor===Array);
    return paramIds.length===0;
}

function getRouteUri(routeArguments, pageInfo) {
    const route_crossroad = get_route_crossroads(pageInfo);
    return route_crossroad.interpolate(routeArguments);
}

/*
function getRouteString() {
    const route_crossroad = parse_route_string(route);
    return route_crossroad._pattern;
}
*/

function get_route_crossroads(pageInfo, {can_be_null=false}={}) {
    assert_internal([true, false].includes(can_be_null));
    assert_page_info(pageInfo, {can_be_null});
    const {route} = pageInfo;
    if( can_be_null && ! route ) {
        return null;
    }
    assert_internal(route);
    const route_crossroad = parse_route_string(route);
    return route_crossroad;
}

function parse_route_string(route_string) {
    assert_internal(route_string.constructor===String, route_string);
    const router = crossroads.create();
    const route_crossroad = router.addRoute(route_string);
    return route_crossroad;
}

function assert_url(url) {
    assert(url && url.constructor===Object, url);
    assert(url.pathname && url.pathname.constructor===String && url.pathname.startsWith('/'), url);
}

function assert_page_info(pageInfo, {can_be_null}={}) {
    assert_usage(
        can_be_null || pageInfo.route,
        pageInfo
    );
}
