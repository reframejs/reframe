const parseUri = require('@brillout/parse-uri');

module.exports = {getUrl, getInitialProps};

function getUrl({uri}) {
    const url = parseUri(uri);
    return url;
}

async function getInitialProps({pageConfig, url, router, context}) {
    const route = getRouteInfo({url, router, pageConfig});

    const loadedProps = (
      pageConfig.getInitialProps &&
      await pageConfig.getInitialProps({route, ...context})
    );

    return {route, ...context, ...loadedProps};
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
