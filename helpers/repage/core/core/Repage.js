const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

module.exports = Repage;

function Repage() {
    const page_objects = [];
    const plugins__global = [];

    return {
        addPages,
        addPlugins,
        getAllPageHandlers,
        getPageHandler,
        getMatchingPageHandler,
        isRepageObject: true,
        plugins: plugins__global,
    };

    function addPages(_pages) {
        assert_usage(
            _pages && _pages.constructor===Array,
            _pages,
            '`addPages()` expects an array as argument but got value printed above instead.',
        );
        _pages.forEach(page_object => {
            assert_page_object({page_object});
            page_objects.push(page_object);
        });
    }

    function getPageHandler(page_object) {
        const page_handler = {};

        // assign plugins
        [
            ...plugins__global,
            ...(page_object.plugins||[]),
        ]
        .map(({pageMixin}) => pageMixin)
        .filter(Boolean)
        .forEach(plugin__page_mixin => {
            assign(page_handler, plugin__page_mixin);
        })

        // assign page object
        assign(page_handler, page_object);
        delete page_handler.plugins;

        return page_handler;
    }

    function assign(obj1, obj2) {
        for(const key in obj2) {
            if( obj1[key] instanceof Array || obj2[key] instanceof Array ) {
                obj1[key] = [
                    ...to_array(obj1[key]),
                    ...to_array(obj2[key]),
                ];
            } else {
                obj1[key] = obj2[key];
            }
        }

        return;

        function to_array(val) {
            if( val instanceof Array ) {
                return val;
            }
            if( val===null || val===undefined ) {
                return [];
            }
            return [val];
        }
    }

    function addPlugins(_plugins) {
        _plugins
        .forEach(plugin => {
            assert_plugin(plugin);
            plugins__global.push(plugin);
        });
    }

    function getAllPageHandlers({isRunningInBrowser}) {
        return (
            page_objects.map(page_object => {
                const page_handler = getPageHandler(page_object);
                assert_page_handler({page_handler, isRunningInBrowser});
                return page_handler;
            })
        );
    }

    function getMatchingPageHandler({url, canBeNull=false, isRunningInBrowser}) {
        const page_handlers = getAllPageHandlers({isRunningInBrowser})

        page_handlers.forEach(page_handler => {
            assert_usage(
                page_handler.routeObject,
                page_handler,
                "Above printed page is missing the routeObject while trying to get the page matching a given url."
            );
        });

        const matchingPages = (
            page_handlers.filter(page_handler => page_handler.routeObject.doesMatchUrl(url, page_handler))
        );

        if( matchingPages.length === 0 && canBeNull ) {
            return null;
        }

        assert_usage(
            matchingPages.length>=1,
            "Couldn't find a page for `"+url+"`.",
            '(You can set the option `canBeNull: true` to make `getMatchingPageHandler` return null instead of throwing an error.)'
        );

        const page_handler = matchingPages[0];
        return page_handler;
    }

}

function assert_plugin(plugin) {
    assert_usage(
        !(plugin instanceof Function),
        plugin,
        'You are trying to add a plugin function but you should add a plugin instance instead. I.e. call the plugin function and add the returned value instead of adding the plugin function itself.'
    );
    assert_usage(
        plugin && plugin.constructor===Object,
        plugin,
        'The plugin instance printed above is not a plain JavaScript object but should be.'
    );
    assert_usage(
        plugin.name,
        plugin,
        'Plugin is required to have a name, i.e. the plugin object printed above is missing the `name` property.'
    );
    assert_usage(
        plugin.pageMixin || plugin.navigationHandler,
        plugin,
        "Trying to add a plugin that has no functionality, i.e. the plugin object printed above is missing `pageMixin` or `navigationHandler`."
    );
}

function assert_page_object({page_object}) {
    assert_usage(
        page_object.route || page_object.view,
        page_object,
        "The above printed page object is not valid; The property `route` or `view` needs to be defined."
    );

    (page_object.plugins||[])
    .forEach(({pageMixin}) => {
        assert_usage(pageMixin);
    })
}

function assert_page_handler({page_handler, isRunningInBrowser}) {
    assert_render_function({page_handler, isRunningInBrowser});
}

function assert_render_function({page_handler, isRunningInBrowser}) {
    assert_internal([true, false].includes(isRunningInBrowser));
    const fn_name = isRunningInBrowser ? 'renderToDom' : 'renderToHtml';
    const fn = page_handler[fn_name];
    assert_usage(
        fn===null || fn instanceof Function,
        page_handler,
        "The above printed page handler has `"+fn_name+"=="+fn+"`.",
        "But `"+fn_name+"` is expected to be either `null` or a function."
    );
}
