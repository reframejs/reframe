const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

const {run, prepare} = require('./common');

module.exports = {
    name: require('./package.json').name,
    isAllowedInBrowser: true,
    pageMixin: {
        renderToDom,
    },
};

async function renderToDom(args) {
    const {page, url} = args;

    args = await prepare(args, {persist_output_in_memory_cache: true});

    args = (
        Object.assign(
            {
                renderDomContext: {},
                route: get_route_object(page, url),
            },
            args
        )
    )

    await run(page.renderDomBegin, args);
    await run(page.renderDomLoad, args);
    await run(page.renderDomApply, args, true);
    await run(page.renderDomEnd, args);
}

function get_route_object(page, url) {
    const route = {url};
    const route_args = page.routeObject.getRouteArguments(url, page);
    assert_internal(route_args===null || route_args.constructor===Object);
    if( route_args ) {
        route.args = route_args;
    } else {
        Object.defineProperty(
            route,
            'args',
            { get: () => {
                assert_usage(
                    false,
                    page,
                    "The route arguments `route.args` for the url `"+url+"` are not available for the page printed above since the page doesn't define a route."
                );
            } }
        );
    }
    return route;
}
