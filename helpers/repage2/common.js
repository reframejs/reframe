const parseUri = require('@atto/parse-uri');

module.exports = {getRouteInfo, getInitialProps};

function getRouteInfo({uri, router}) {
    const url = parseUri(uri);
    const routeArguments = router.getRouteArguments(url);

    // TODO check if same value than on server
    const route = {
        args: routeArguments || {},
        url,
    };

    return route;
}

async function getInitialProps({pageConfig, route}) {
    const initialProps = {route};

    if( pageConfig.getInitialProps ) {
        Object.assign(initialProps, await pageConfig.getInitialProps(initialProps));
    }

    return initialProps;
}
