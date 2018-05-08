const assert_internal = require('reassert/internal');
const parseUri = require('@atto/parse-uri');

module.exports = hydratePage;

async function hydratePage({pageConfig, router2, navigator=getDefaultNavigator(), renderToDom2}) {
    const uri = navigator.getCurrentRoute();
    const url = parseUri(uri);
    const routeArguments = router2.getRouteArguments(url);

    // TODO check if same value than on server
    const route = {
        args: routeArguments || {},
        url,
    };

    const initialProps = {route};

    if( pageConfig.getInitialProps ) {
        Object.assign(initialProps, await pageConfig.getInitialProps(initialProps));
    }

    await renderToDom2({pageConfig, initialProps});
}

function getDefaultNavigator() {

    const defaultNavigator = {
        getCurrentRoute,
    };

    return defaultNavigator;

    function getCurrentRoute() {
        const current_route = window.location.href.replace(window.location.origin, '');
        assert_internal(current_route.startsWith('/'));
        return current_route;
    }
}
