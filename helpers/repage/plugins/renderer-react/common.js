const assert = require('reassert');
const assert_usage = assert;
const assert_internal = assert;

const React = require('react');

const rootContainerId = 'react-root';

module.exports = {
    get_initial_props,
    loadData,
    get_views,
};

function get_initial_props(route, contextObject) {
    assert_internal(route);
    assert_internal(contextObject.initialProps, contextObject);
    const initial_props = Object.assign({route}, contextObject.initialProps);
    return initial_props;
}

function get_views({page, initial_props}) {
    const {view: view_page_prop, viewWrapper} = page;

    if( ! view_page_prop ) {
        return [];
    }

    const views = (
        (
            view_page_prop.constructor !== Array ? (
                [view_page_prop]
            ) : (
                view_page_prop
            )
        )
        .map(view => {
            assert_usage(
                view
            );
            if( view.constructor!==Object || ! view.view ) {
                return {
                    react_component: view,
                    container_id: rootContainerId,
                };
            }
            return {
                react_component: view.view,
                container_id: view.containerId || rootContainerId,
            };
        })
        .map(view_object => {
            assert_internal(view_object.react_component, view_object);
            let react_element = React.createElement(view_object.react_component, initial_props);
            if( viewWrapper ) {
                const extra_args = Object.assign(
                    {
                        reactComponent: view_object.react_component,
                        containerId: view_object.container_id,
                    },
                    initial_props
                );
                assert_internal(extra_args.reactComponent);
                assert_internal(extra_args.route.url, extra_args);
                assert_internal(extra_args.route.url.pathname, extra_args);
                assert_internal(extra_args.route.url.pathname.startsWith('/'), extra_args);
                react_element = viewWrapper(react_element, extra_args);
                assert_usage(react_element);
            }
            view_object.react_element = react_element;
            return view_object;
        })
    );

    views.forEach((view_object, i) => {
        assert_internal(view_object.react_component);
        assert_internal(view_object.react_element);
        assert_internal(view_object.container_id);

        views.slice(0, i).forEach(view_object_2 => {
            assert_usage(
                view_object.container_id !== view_object_2.container_id,
                page,
                view_object,
                view_object_2,
                "The two views printed above of the page printed above have the same container id"
            );
        });
    });

    return views;
}

async function loadData(args) {
    const {page, renderHtmlContext, renderDomContext} = args;
    assert(!renderHtmlContext || !renderDomContext);
    const context = renderHtmlContext || renderDomContext;
    context.initialProps = (
        page.getInitialProps ? (
            await page.getInitialProps(args)
        ) : (
            {}
        )
    );
}
