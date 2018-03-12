!INLINE ./header.md --hide-source-path

!MENU
!MENU_ORDER 40

<br/>

# Customization Manual

The customization manual acts as reference for advanced Reframe customization. Basic customizations are covered in the Usage Manual.

As your app grows, you will likely need to implement edge cases not covered by Reframe.
In these situations, we refer to this Customization Manual.
With willingness to dive into Reframe and to re-write parts, pretty much all edge cases should be achievable.

Reframe consists of three packages;
`@reframe/build` that transpiles and bundles code,
`@reframe/server` that creates a server that serves dynamic HTMLs and static assets,
and `@reframe/browser` that hydrates React components in the browser.
Reframe is designed so that each of these three packages can be replaced with code of your own.

If you replace `@reframe/browser` with code of your own, then you have full control over the browser-side.
If you replace `@reframe/server` with code of your own, then you have full control over the server.
If you replace `@reframe/build` with code of your own, then you have full control over the build step.
And, if you replace all three packages, you effectively get rid of Reframe.

The customizing manual gives an overview of how packages can be re-written but partially lacks detailed information.
Open a GitHub issue to get detailed info and support.

##### Contents

 - [Custom Server](#custom-server)
   - [Reframe as hapi plugin](#reframe-as-hapi-plugin)
   - [Full Customization](#full-customization)
 - [Custom Browser JavaScript](#custom-browser-javascript)
   - [Custom Browser Entry](#custom-browser-entry)
   - [External Scripts](#external-scripts)
   - [Common Script](#common-script)
   - [Full Customization](#full-customization-1)
 - [Custom Build](#custom-build)
   - [Webpack Config Modification](#webpack-config-modification)
   - [Full Custom Webpack Config](#full-custom-webpack-config)
   - [Full Build Customization](#full-build-customization)
 - [Custom Repage](#custom-repage)
 - [Get rid of Reframe](#get-rid-of-reframe)

## Custom Server

##### Contents

 - [Reframe as hapi plugin](#reframe-as-hapi-plugin)
 - [Full Customization](#full-customization)

### Reframe as hapi plugin

Instead of using Reframe with its CLI, we can use Reframe as hapi plugins.
For example:

~~~js
!INLINE ../examples/custom/server/hapi-server.js
~~~


### Full Customization

Instead of using `const getHapiPlugins = require('@reframe/server/getHapiPlugins');` we can also re-write the whole server from scratch.

This allows us, for example, to choose any server framework.
The following is a custom server implementation using Express instead of hapi.

~~~js
!INLINE ../examples/custom/server/express-server.js
~~~

## Custom Browser JavaScript

##### Contents

 - [Custom Browser Entry](#custom-browser-entry)
 - [External Scripts](#external-scripts)
 - [Common Script](#common-script)
 - [Full Customization](#full-customization-1)

### Custom Browser Entry

By default Reframe automatically generates a browser entry code such as the following:

~~~js
var hydratePage = require('/usr/lib/node_modules/@reframe/cli/node_modules/@reframe/browser/hydratePage.js');
var pageConfig = require('/home/brillout/tmp/reframe-playground/pages/HelloPage.js');

// hybrid cjs and ES6 module import
pageConfig = Object.keys(pageConfig).length===1 && pageConfig.default || pageConfig;

hydratePage(pageConfig);
~~~

We can, however, create the browser entry code ourselves.

We do that by providing a `pages/MyPage.entry.js` file along the page config `pages/MyPage.js`.
Reframe will then use `MyPage.entry.js` code as browser entry instead of generating one.
Reframe matches `MyPage.entry.js` with `MyPage.js` because the two filenames share the same prefix `MyPage`.

For example:

~~~js
!INLINE ../examples/pages/TrackingPage.js
~~~

~~~js
!INLINE ../examples/pages/TrackingPage.entry.js
~~~

### External Scripts

The page's `<head>` is fully customaziable,
and we can load external scripts (such as `<script async src='https://www.google-analytics.com/analytics.js'></script>`),
load a ES6 module with `<script type="module">`,
add a `async` attribute to a `<script>`,
etc.

See the "Custom Head" section of the Usage Manual for more information.

### Common Script

Multiple pages can share common browser code by using the `diskPath` property in the page config, as shown in the following example:

~~~js
!INLINE ../examples/custom/browser/pages/terms.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/privacy.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/PageCommon.mixin.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/PageCommon.entry.js
~~~

### Full Customization

In the section "Custom Browser Entry" we saw how to write the browser entry code ourself.

For example:

~~~js
import hydratePage from '@reframe/browser/hydratePage';
import MyPage from 'path/to/MyPage-page-config.js';

hydratePage(MyPage);
~~~

But we can go further by not using `@reframe/browser/hydratePage` and re-writing that part ouserlves.

Let's look at the code of `@reframe/browser/hydratePage`

~~~js
!INLINE ../core/browser/hydratePage.js
~~~

As we can see, the code initializes a [Repage](https://github.com/reframejs/reframe/tree/master/helpers/repage) instance and calls `@repage/browser`'s `hydratePage()` function.

Instead of using Repage we can manually hydrate the page ourselves.
The following is an example of doing so.
At this point, our browser JavaScript doesn't depend on Reframe nor on Repage.
It is fully under our control.

~~~js
!INLINE ../examples/custom/browser/pages/custom-hydration.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/custom-hydration.entry.js
~~~

## Custom Build

##### Contents

 - [Webpack Config Modification](#webpack-config-modification)
 - [Full Custom Webpack Config](#full-custom-webpack-config)
 - [Full Build Customization](#full-build-customization)

### Webpack Config Modification

The webpack configuration generated by Reframe can be modified by providing
`webpackServerConfig()` and `webpackBrowserConfig()`
in the `reframe.config.js` file.

~~~js
// reframe.config.js

module.exports = {
    webpackBrowserConfig,
    webpackServerConfig,
};
~~~

The following example uses `webpackBrowserConfig()` to add the PostCSS loader to the configuration.

~~~js
!INLINE ../examples/custom/build/webpack-config-mod/reframe.config.js
~~~

### Full Custom Webpack Config

The
`webpackServerConfig()` and `webpackBrowserConfig()` options
(mentioned in the previous section)
also allows us to use an entire custom webpack configuration.

The only restriction for a fully custom config is that the browser entry file and the corresponding server entry file share the same name prefix.
Reframe can't otherwise know which browser entry is meant for which page config.
For example, a browser entry saved at `/path/to/MyPage.entry.js` would match a page config saved at `/path/to/MyPage.html.js`, because they share the same prefix `MyPage`.

The following is an example for a entirely custom config.

~~~js
!INLINE ../examples/custom/build/custom-webpack-config/reframe.config.js
~~~

### Full Build Customization

By default, Reframe uses webpack.
But we can implement a fully custom build step, which means that we can use a build tool other than webpack.

The following is an example of a custom build step using [Rollup](https://github.com/rollup/rollup) and [Node.js's support for ES modules](https://nodejs.org/api/esm.html) over the --experimental-modules flag.

~~~js
!INLINE ../examples/custom/build/custom-bundler/server.mjs
~~~
~~~js
!INLINE ../examples/custom/build/custom-bundler/build-all.mjs
~~~
~~~js
!INLINE ../examples/custom/build/custom-bundler/build-script.mjs
~~~
~~~js
!INLINE ../examples/custom/build/custom-bundler/build-html.mjs
~~~
~~~js
!INLINE ../examples/custom/build/custom-bundler/get-pages.mjs
~~~

## Custom Repage

Reframe is built on top of [Repage](https://github.com/reframejs/reframe/tree/master/helpers/repage),
a low-level plugin-based page management library,
and you can use Reframe with a custom Repage instance.

To do so,
and as shown in the example below,
we export a `getRepageInstance` function
that returns the Repage instance we want to use
in the `reframe.config.js` file.

The `reframe.config.js` file can be located at any ancestor directory of the `pages/` directory.

~~~js
const Repage = require('@repage/core');
const RepageRouterCrossroads = require('@repage/router-crossroads');
const RepageRenderer = require('@repage/renderer');
const RepageRendererReact = require('@repage/renderer-react');

module.exports = {getRepageInstance};

function getRepageInstance() {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
    ]);

    return repage;
}
~~~

## Get rid of Reframe

As shown in this document, every part of Reframe can be re-written to depend on `@repage` packages only.
And [Repage](https://github.com/reframejs/reframe/tree/master/helpers/repage) can progressively be overwritten over time as well.
This means that we can eventually and over time get rid of the entire Reframe code and the entire Repage code.
