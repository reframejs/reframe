!INLINE ./header.md --hide-source-path

!MENU
!MENU_ORDER 40

<br/>

# Customization Manual

The customization manual acts as reference for advanced Reframe customization. Basic customization are covered in the Usage Manual.

As your app grows, you will likely need to implement edge cases not covered by Reframe.
In these situations, we refer to this Customization Manual.
With willingness to dive into Reframe and to re-write parts, pretty much all edge cases should be achievable.

Reframe consists of three packages;
`@reframe/build` that transpiles and bundles code,
`@reframe/server` that creates a server that serves dynamic HTMLs and static assets,
and `@reframe/browser` that hydrates React components in the browser.
Reframe is designed so that each package can be replaced with code of your own.

If you replace `@reframe/browser` with code of your own, then you have full control over the browser JavaScript.
If you replace `@reframe/server` with code of your own, then you have full control over the server.
If you replace `@reframe/build` with code of your own, then you have full control over the build step.
And, if you replace all three packages, you effectively got rid of Reframe.

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

Instead of using Reframe as CLI, we can use it as hapi plugins.
For example:

~~~js
!INLINE ../examples/custom/server/hapi-server.js
~~~


### Full Customization

Instead of using `const {getReframeHapiPlugins} = require('@reframe/server');` we can also re-write the whole server from scratch.

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

When Reframe stumbles upon a `.universal.js` or `.dom.js` page config, it automatically generates a browser entry code that will load in the browser.

The following is an example of such generated browser entry code.

~~~js
var hydratePage = require('/usr/lib/node_modules/@reframe/cli/node_modules/@reframe/browser/hydratePage.js');
var pageConfig = require('/home/brillout/tmp/reframe-playground/pages/HelloPage.universal.js');

// hybrid cjs and ES6 module import
pageConfig = Object.keys(pageConfig).length===1 && pageConfig.default || pageConfig;

hydratePage(pageConfig);
~~~

We can, however, create the browser entry code ourselves.

Instead of providing a `.universal.js` or `.dom.js` page config,
we provide only one page config `.html.js` along with a `.entry.js` file.
Reframe will then use the `.entry.js` code as browser entry instead of generating one.

For example:

~~~js
!INLINE ../examples/pages/TrackingPage.html.js
~~~

~~~js
!INLINE ../examples/pages/TrackingPage.entry.js
~~~

### External Scripts

The page's `<head>` is fully customaziable,
and we can load external scripts such as `<script async src='https://www.google-analytics.com/analytics.js'></script>`,
load a `<script>` as ES6 module,
add a `async` attribute to a `<script>`,
etc.

See the "Custom Head" section of the Usage Manual for more information.

### Common Script

Multiple pages can share common browser code by using the `diskPath` property in the page config, as shown in the following example:

~~~js
!INLINE ../examples/custom/browser/pages/terms.html.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/privacy.html.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/PageCommon.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/PageCommon.entry.js
~~~

### Full Customization

We saw in the section "Custom Browser Entry" how to write the browser entry code ourself.

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

As we can see, the code simply initializes a Repage instance and calls `@repage/browser`'s `hydratePage()` function.

Instead of using Repage we can manually hydrate the page ourselves.
The following is an example of doing so.
At this point, our browser JavaScript doesn't depend on Reframe nor on Repage.
It is fully under our control.

~~~js
!INLINE ../examples/custom/browser/pages/custom-browser.html.js
~~~
~~~js
!INLINE ../examples/custom/browser/pages/custom-browser.entry.js
~~~

## Custom Build

##### Contents

 - [Webpack Config Modification](#webpack-config-modification)
 - [Full Custom Webpack Config](#full-custom-webpack-config)
 - [Full Build Customization](#full-build-customization)

### Webpack Config Modification

The webpack configuration generated by Reframe can be modified by providing
`webpackServerConfig` and `webpackBrowserConfig`
in the `reframe.config.js` file.

~~~js
// reframe.config.js

module.exports = {
    webpackBrowserConfig,
    webpackServerConfig,
};
~~~

The following example uses `getWebpackBrowserConfig()` to add the PostCSS loader to the configuration.

~~~js
!INLINE ../examples/custom/build/webpack-config-mod/reframe.config.js
~~~

### Full Custom Webpack Config

The
`webpackServerConfig` and `webpackBrowserConfig` option set in `reframe.config.js`,
mentioned in the previous section,
also allows us to use an entire custom webpack configuration.

The only restriction for a fully custom config is that the browser entry file and the corresponding server entry file have the same base name.
Reframe can't otherwise know which browser entry is meant for which page config.
For example, a browser entry saved at `/path/to/MyPage.entry.js` would match a page config saved at `/path/to/MyPage.html.js`, because they share the same base name `MyPage`.

The following is an example for a entirely custom config.

~~~js
!INLINE ../examples/custom/build/custom-webpack-config/reframe.config.js
~~~

### Full Build Customization

By default, Reframe uses webpack.
But we can implement a fully custom build step, which means that we can use a build tool other than webpack.

The following is an example of a custom build step using [Rollup](https://github.com/rollup/rollup) and [Node.js's support for ES modules over the --experimental-modules flag](https://nodejs.org/api/esm.html).

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

Reframe is built on top of [Repage](https://github.com/brillout/repage),
a low-level plugin-based page management library,
and you can use Reframe with a custom Repage instance.

To do so,
and as shown in the example below,
we export a `getRepageInstance` function
that returns the Repage instance we want to use
in a `reframe.config.js` file.

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
In turn, [Repage](https://github.com/brillout/repage) can progressively be overwritten over time as well.
This means that we can eventually and over time get rid of the entire Reframe and the entire Repage code.
