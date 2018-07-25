const parseUri = require('@brillout/parse-uri');

module.exports = {getUrl, getInitialProps};

function getUrl({uri}) {
    const url = parseUri(uri);
    return url;
}

async function getInitialProps({pageConfig, url, router, initialProps}) {
    initialProps = {...initialProps};

    const route = getRouteInfo({url, router, pageConfig});
    initialProps = {route, ...initialProps};

    if( pageConfig.getInitialProps ) {
        initialProps = {...initialProps, ...(await pageConfig.getInitialProps(initialProps))};
    }

    return initialProps;
}

function getRouteInfo({url, router, pageConfig}) {
    const routeArguments = router.getRouteArguments(url, pageConfig);

    // TODO-eventually check if same value than on server
    const route = {
        args: routeArguments || {},
        url,
    };

    return route;
}
