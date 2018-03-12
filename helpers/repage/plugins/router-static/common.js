module.exports = {
    name: require('./package.json').name,
    isAllowedInBrowser: true,
    pageMixin: {
        doesMatchUrl,
        getRouteArguments,
        hasOnlyOneUniqueRoute,
        getRouteUri,
    }
};

function doesMatchUrl(url, pageInfo) {
    const route = get_route(pageInfo);
    return route === url.pathname;
}

function getRouteArguments(url, pageInfo) {
    if( doesMatchUrl(url, pageInfo) ) {
        return {};
    }
    return null;
}

function hasOnlyOneUniqueRoute() {
    return true;
}

function getRouteUri(routeArguments, pageInfo) {
    const route = get_route(pageInfo);
    return route;
}


function get_route(pageInfo) {
    return pageInfo.route;
}
