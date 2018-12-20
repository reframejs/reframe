const assert = require('reassert');

module.exports = {getInitialProps};

async function getInitialProps({pageConfig, url, router, requestContext, isNodejs=false}) {
    assert.internal(url && url.constructor===Object && url.uri && url.uri.constructor===String && url.pathname && url.pathname.constructor===String, url);
    assert.internal([true,false].includes(isNodejs));
    const routeArguments = router.getRouteArguments(url, pageConfig);

    assert.internal((requestContext||{}).constructor===Object);
    assert.internal(url.constructor===Object);
    assert.internal((routeArguments||{}).constructor===Object);
    const getProps = loadedProps => ({
      ...requestContext,
      ...url,
      ...routeArguments,
      ...loadedProps,
      loadedProps,
      requestContext,
      route: {
        url,
        args: routeArguments,
      },
      isNodejs,
    });

    const loadedProps = (
      pageConfig.getInitialProps &&
      await pageConfig.getInitialProps(getProps())
    );

    return getProps(loadedProps);
}
