!MENU_ORDER 30
!MENU_INDENT 12
!INLINE ./snippets/header.md --hide-source-path
!MENU
&nbsp;

# Usage Manual

### Basics

- [Getting Started](#getting-started)
- [CSS](#css)
- [Static Assets](#static-assets)
- [Async Data](#async-data)
- [Navigation & Links](#navigation--links)
- [`doNotRenderInBrowser`](#donotrenderinbrowser)
- [`renderHtmlAtBuildTime`](#renderhtmlatbuildtime)

### Use Cases

- Flexible stack
  - [Add/Remove Server](#add-remove-server)
  - [Add/Remove Frontend](#add-remove-frontend)
  - [Add/Remove Database](#add-remove-database)
- Deploy
  - [Static Deploy](#static-deploy)
  - [Serverless Deploy](#serverless-deploy)
- Integrations
  - [Vue](#vue)
  - [React Router](#react-router)
  - [TypeScript](#typescript)
  - [Express](#express)
  - [Koa](#koa)
  - [PostCSS](#postcss)
  - [React Native (Web)](#react-native-web)
  - [React Native (Web) + React Router](#react-native-web--react-router)
  - [Bootstrap](#boostrap)
  - [Semantic UI](#semantic-ui)
  - [Frontend Libraries](#frontend-libraries)

### Custom

*Full customization. Based on eject.*

- Server
  - [Custom Server](#custom-server)
  - [Custom Server Framework (Express, Koa, ...)](#custom-server-framework-express-koa-)
  - [Fully Custom Server](#fully-custom-server)
- Rendering
  - [Custom HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ...](#custom-html-head-meta-html-)
  - [Custom Renderer](#custom-renderer)
- Browser
  - [Custom Default Browser Entry](#custom-default-browser-entry)
  - [Custom Page Browser Entry](#custom-page-browser-entry)
  - [Fully Custom Browser Entry](#fully-custom-browser-entry)
- Routing
  - [Advanced Routing](#advanced-routing)
  - [Custom Router](#custom-router)
- Build
  - [Custom Babel](#custom-babel)
  - [Custom Webpack](#custom-webpack)
  - [Fully Custom Build](#fully-custom-build)


<br/>
<br/>





## Getting Started

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #basics --hide-source-path
<br/>
<br/>
<br/>





## CSS

A CSS file can be loaded and applied by importing it.

~~~js
import './GlitterStyle.css';
~~~

Example of a page using CSS:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)

!INLINE ./snippets/section-footer.md #basics --hide-source-path


## Static Assets

Static assets (images, fonts, videos, etc.) can be imported as well
but importing an asset doesn't actually load it:
Only the URL of the asset is returned.
It is up to us to use/fetch the URL of the asset.

~~~js
import diamondUrl from './diamond.png';

// do something with diamondUrl, e.g. `await fetch(diamondUrl)` or `<img src={diamondUrl}/>`
~~~

In addition, static assets can be referenced in CSS by using the `url` data type.

~~~css
.diamond-background {
    background-image: url('./diamond.png');
}
~~~

Example of a page using fonts, images and other static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)

!INLINE ./snippets/section-footer.md #basics --hide-source-path






## Async Data

!INLINE ./sections/usage-async-data.md --hide-source-path

!INLINE ./snippets/section-footer.md #basics --hide-source-path





## Navigation & Links

The standard way to navigate between pages is to use the HTML link tag `<a>`.

See [Advanced Routing](#advanced-routing) for alternative ways of navigating.

Example:

~~~js
!INLINE ../examples/basics/pages/page-a.config.js --hide-source-path
~~~
~~~js
!INLINE ../examples/basics/pages/page-b.config.js --hide-source-path
~~~

!INLINE ./snippets/section-footer.md #basics --hide-source-path







## `doNotRenderInBrowser`

!INLINE ./sections/doNotRenderInBrowser.md --hide-source-path

!INLINE ./snippets/section-footer.md #basics --hide-source-path



## `renderHtmlAtBuildTime`

Every page is rendered to HTML.
(React and Vue components can be rendered to the DOM as well as to HTML.)

The page config option `renderHtmlAtBuildTime` allows you to control whether the page is rendered statically at build-time or dynamically at request-time.

 - `renderHtmlAtBuildTime: false` (default value)
   <br/>
   The page is rendered to **HTML at request-time**.
   <br/>
   The page is (re-)rendered to HTML every time the user requests the page.
 - `renderHtmlAtBuildTime: true`
   <br/>
   The page is rendered to **HTML at build-time**.
   <br/>
   The page is rendered to HTML only once, when Reframe is building and transpiling your app.

By default a page is rendered to HTML at request-time.
But if a page is static
(a landing page, a blog post, a personal homepage, etc.) it is wasteful to re-render its HTML on every page request.

By setting `renderHtmlAtBuildTime: true` to all your pages,
you effectively remove the need of a Node.js server.
You can then deploy your app to a static host such as Netlify or GitHub Pages.

!INLINE ./snippets/section-footer.md #basics --hide-source-path















## Static Deploy

If your app is html-static, you can deploy it to a static host.

Your app is html-static when all your page configs have `renderHtmlAtBuildTime: true`.
In that case,
all HTMLs are rendered at build-time,
your app consists of static browser assets only,
no Node.js server is required,
and your app can be statically served.

If you add the `@reframe/deploy-git` plugin you can then
run `$ reframe deploy` to automatically deploy your app.

!INLINE ./sections/deploy-static.md --hide-source-path

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path




## Serverless Deploy

!INLINE ./sections/deploy-serverless.md --hide-source-path
!INLINE ./snippets/section-footer.md #use-cases --hide-source-path




## Add/Remove Server

By setting `renderHtmlAtBuildTime: true` to all your pages you remove the need for a Node.js server.
See
[`renderHtmlAtBuildTime`](#renderhtmlatbuildtime).

On the other hand,
if you need a Node.js server
you can eject Reframe's server code:
~~~shell
$ reframe eject server
~~~
You then have full control over the Node.js server.

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path



## Add/Remove Frontend

By setting `doNotRenderInBrowser: true` to all your page configs you remove browser-side JavaScript.

You app is then only a backend with plain old HTML.

You can't have interactive views but
you can still have dynamic content by rendering the HTML dynamically at request-time.

More infos at
[`doNotRenderInBrowser`](#donotrenderinbrowser)
and
[`renderHtmlAtBuildTime`](#renderhtmlatbuildtime).

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path



## Add/Remove Database

If you didn't eject the server code already then eject it:

~~~js
$ reframe eject server
~~~

(All starters, with the exception of the `react-frontend` starter, have already have ejected the server code for you.)

Once you have eject and gained control over the server, you are free to use add/remove any database/ORM.





## Vue

With the
[`@reframe/vue`](/plugins/vue) plugin
you can use Reframe with Vue instead of React.

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path

## React Router

You can use the React Router components by adding the [@reframe/react-router](/plugins/react-router) plugin.

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path

## TypeScript

You can write your app with TypeScript by adding the [@reframe/typescript](/plugins/typescript) plugin.

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path

## Express

You can use Express (instead of Hapi) by using the [@reframe/express](/plugins/express) plugin.

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path

## Koa

You can use Koa (instead of Hapi) by using the [@reframe/koa](/plugins/koa) plugin.

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path

## PostCSS

You can write your styles with PostCSS by adding the [@reframe/postcss](/plugins/postcss) plugin.

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path




## React Native (Web)

If you want an app on the web and on mobile,
you may consider create a web app with Reframe and [React Native Web](https://github.com/necolas/react-native-web)
and a mobile app with [React Native](https://facebook.github.io/react-native/).
Both app will then share most/lots of code.

Add the [`@reframe/react-native-web`](/plugins/react-native-web) plugin to render your page's React components with React Native Web.

Examples of apps using Reframe + RNW:
 - [/plugins/react-native-web/example](/plugins/react-native-web/example)
 - [/examples/react-native-web-and-react-router](/examples/react-native-web-and-react-router)

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path






## React Native (Web) + React Router

As mentioned in the previous section you can use Reframe + React Native Web to share code with your React Native mobile app.

And you can share routing logic by using Reframe + React Native Web + [React Router Web](https://reacttraining.com/react-router/web) for your web app and React Native + [React Router Native](https://reacttraining.com/react-router/native) for your mobile app.

For example:
 - [/examples/react-native-web-and-react-router](/examples/react-native-web-and-react-router)

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path






## Bootstrap

See section [Frontend Libraries](#frontend-libraries) below.

## Semantic UI

See section [Frontend Libraries](#frontend-libraries) below.

## Frontend Libraries

There are two ways to add third party browser code:
 - Directly add the code with `<script>` and `<link>` tags.
 - Include the code into Reframe's bundles with `import 'thirdparty/main.js';` and `import 'thirdparty/style.css';`.

See
[Custom HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ...](#custom-html-head-meta-html-)
for how to change the HTML to add `<script>` and `<link>` tags.

See
[Custom Default Browser Entry](#custom-default-browser-entry)
for how to eject the browser entry to add
`import 'thirdparty/main.js';` and `import 'thirdparty/style.css';`.

Example that uses jQuery and Semantic UI:
 - [/examples/custom-browser-lib](/examples/custom-browser-lib)

!INLINE ./snippets/section-footer.md #use-cases --hide-source-path













## Custom Server

By default, Reframe creates a server with the web framework hapi ([hapijs.com](https://hapijs.com/)).

You can customize the hapi server by ejecting it with `$ reframe eject server`.

We encourage you to eject the server and you should if you want to
 - Add custom routes
 - Add API endpoints
 - Add authentication endpoints
 - Use a process manager such as PM2
 - etc.

Running `$ reframe eject server` will copy the following code to your codebase.

~~~js
!INLINE ../plugins/hapi/start.js
~~~

!INLINE ./snippets/section-footer.md #custom --hide-source-path







## Custom Server Framework (Express, Koa, ...)

!INLINE ./sections/custom-server-framework.md --hide-source-path

!INLINE ./snippets/section-footer.md #custom --hide-source-path




## Fully Custom Server

The following ejectables give you full control over the server.

- `$ reframe eject server`
  <br/>
  Eject the code that creates the server instance.
  See previous sections.
- `$ reframe eject server-integration`
  <br/>
  Eject the code that integrates the server framework with Reframe.
  See previous sections.
- `$ reframe eject server-rendering`
  <br/>
  Eject the code that implements server-side rendering. (The generation of HTML of pages at request-time.)
- `$ reframe eject server-assets`
  <br/>
  Eject the code that implements the serving of static browser assets (JavaScript files, CSS files, images, fonts, etc.)

If you eject all these ejectables then every single server LOC is in your codebase and you have full control over the server logic.

!INLINE ./snippets/section-footer.md #custom --hide-source-path









## Custom HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ...

Reframe uses [`@brillout/index-html`](https://github.com/brillout/index-html) to generate HTML.

You have full control over the "outer-part" HTML.
(`<meta>`, `<!DOCTYPE html`>, `<head>`, `<html>`, `<body>`, `<script>`, etc.)

There are two ways to change the outer-part HTML:
 - By creating a `index.html` file
 - Over the page config

1. Over the page config:

~~~js
!INLINE ../examples/custom-head/pages/landing.config.js
~~~

Note that if `awesome-lib.js` and `awesome-lib.css` are inside your project, you can't follow this
technique. Instead you will have to [customize the browser entry](#custom-default-browser-entry).

2. Over a `index.html` file saved in your app's root directory:

~~~js
!INLINE ../examples/custom-head/index.html
~~~

Also, the `indexHtml` page config option allows you to override the `index.html` file for a specific page:

~~~js
!INLINE ../examples/custom-head/pages/about.config.js
~~~

All `@brillout/index-html` options are available over the page config.

See [`@brillout/index-html`'s documentation](https://github.com/brillout/index-html) for the list of options.

Example:
 - [/examples/custom-head](/examples/custom-head)

If you want to use something else than `@brillout/index-html`, then you can eject the renderer,
see [Custom Renderer](#custom-renderer).

!INLINE ./snippets/section-footer.md #custom --hide-source-path







## Custom Renderer

By default Reframe renders the `view` property of your page configs with React.

You can customize how your views are rendered.

Either use another plugin in the [list of renderer plugins](/docs/plugins.md#renderers) or eject the renderer with `$ reframe eject renderer`.

Ejecting the React renderer will copy the following code to your codebase.

~~~js
!INLINE ../plugins/react/renderToDom.js
~~~
~~~js
!INLINE ../plugins/react/renderToHtml.js
~~~
~~~js
!INLINE ../plugins/react/common.js
~~~

!INLINE ./snippets/section-footer.md #custom --hide-source-path







## Custom Default Browser Entry

You can customize the browser entry code by running `$reframe eject browser`.

We encourage you to do so and you should if you want to:
  - Initialize user tracking such as Google Analytics
  - Initialize error tracking such as Sentry
  - Add a frontend library such as Bootstrap or Semantic UI
  - etc.

Running `$reframe eject browser` ejects the following code.

~~~js
!INLINE ../plugins/browser/browserInit.js
~~~

!INLINE ./snippets/section-footer.md #custom --hide-source-path






## Custom Page Browser Entry

You can customize the browser entry code for a single page
without affecting the browser entry code of other pages.

You do this by setting the page config `browserInit`.
For example:

~~~js
!INLINE ../examples/custom-browser/pages/custom-hydration.config.js
~~~

~~~js
!INLINE ../examples/custom-browser/pages/custom-hydration.js
~~~

You can see the example in full and other examples at [/examples/custom-browser](/examples/custom-browser).

!INLINE ./snippets/section-footer.md #custom --hide-source-path






## Fully Custom Browser Entry

You can as well eject the code that orchestrates the hydration of the page by running `$ reframe eject browser-hydrate`.
If you want to customize the rendering process itself
you should run `$ reframe eject renderer` instead,
see [Custom Renderer](#custom-renderer).

The browser entry of each page is generated at build-time.
You can take control over the generation of browser entries by running `$ reframe eject build-browser-entries`.
We recommand to use the previously mentioned ejectables instead.
Use this ejectable as last resort.

!INLINE ./snippets/section-footer.md #custom --hide-source-path






## Advanced Routing

###### Reframe's default router

By default, Reframe uses [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) to match URLs with a the page config's `route`.
(React Router uses `path-to-regexp` as well.)

For example, in the following page config, Reframe will use `path-to-regexp` to determine if a URL matches the page's route `'/hello/:name'`.

~~~jsx
const HelloPage = {
    route: '/hello/:name',
    view: ({route: {args: {name}}}) => <div>Welcome {name}</div>,
};
~~~

See [`path-to-regexp`'s docs](https://github.com/pillarjs/path-to-regexp) for further information about the route string syntax.

###### Advanced routing with React Router

You can use React Router's components by adding the plugin [`@reframe/react-router`](/react-router).

Using React Router components allow you to implement:
 - **pushState-navigation**
   <br/>
   To navigate to a new page by manipulating the DOM instead of loading the new page's HTML.
   (A detailed explanation of "pushState-navigation" follows below.)
   Such navigation make sense for route changes that cause only small changes on the page.
   It would for example be prohibitive to reload the entire page for a URL change that causes only minor changes to a little box on the page.
 - **Nested Routes**
   <br/>
 - **SPAs**
   <br/>
   Apps where the app's entire browser-side code is bundled in one script and loaded at once.
 - **URL hash**
   <br/>
   URLs with a `window.location.hash`.

###### Html-navigation VS pushState-navigation

There are two ways of navigating between pages:
 - *HTML-navigation*
   <br/>
   When clicking a link, the new page's HTML is loaded.
   (In other words, the browser discards the current DOM and builds a new DOM upon the new page's HTML.)
 - *pushState-navigation*
   <br/>
   When clicking a link, the URL is changed by `history.pushState()` and the DOM is manipulated (instead of loading the new page's HTML).

By default, Reframe does HTML-navigation when using `<a>` links between pages defined with page configs.

###### pushState-navigation

By using React Router's components you can do pushState-navigation.
Pages are then defined by React Router's component instead of page configs.

Note that with *page* we denote any view that is identified with a URL:
If two URLs have similar views that differ in only in a small way,
we still speak of two pages because these two views have two different URLs.

Also note that the broswer-side code is splitted only between pages defined with page configs,
and pages defined with React Router components will share the same browser-side code bundle.


!INLINE ./snippets/section-footer.md #custom --hide-source-path





## Custom Router

Reframe can be used with any routing library.

Either use another plugin in the [list of router plugins](/docs/plugins.md#routing) or eject the router with `$ reframe eject router`.

!INLINE ./snippets/section-footer.md #custom --hide-source-path






## Custom Babel

You can customize the babel config by creating a `.babelrc` file.

Example:
 - [/examples/custom-babel](/examples/custom-babel)

!INLINE ./snippets/section-footer.md #custom --hide-source-path






## Custom Webpack

You can customize the webpack config by using `webpackBrowserConfig` and/or `webpackNodejsConfig`.

~~~js
// reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ],
    webpackBrowserConfig: webpackConfig,
    webpackNodejsConfig: webpackConfig,
};

function webpackConfig({
    config,

    // Webpack entries
    // For `webpackNodejsConfig` this is the list of found page config paths
    // For `webpackBrowserConfig` this is the list of (generated) browser entry files
    entries,

    // The directory where the built assets are expected to be
    outputPath,

    // Config modifiers provided by the package `@brillout/webpack-config-mod`
    setRule, getRule, getEntries, addBabelPreset, addBabelPlugin, modifyBabelOptions
}) {
    // Either
    //  - apply modifications to `config` (by using modifiers or manually), or
    //  - return an entirely new config object (by using `entries` and `outputPath`)

    return config;
}
~~~

All `@brillout/webpack-config-mod` config modifiers are listed at [/helpers/webpack-config-mod](/helpers/webpack-config-mod).

Examples:
 - Using config modifiers [/examples/custom-webpack](/examples/custom-webpack)
 - Fully custom config [/examples/custom-webpack-full](/examples/custom-webpack-full)
 - Source code of [`@reframe/postcss`](/plugins/postcss)
 - Source code of [`@reframe/react`](/plugins/react)
 - Source code of [`@reframe/typescript`](/plugins/typescript)

!INLINE ./snippets/section-footer.md #custom --hide-source-path



## Fully Custom Build

Run `$ reframe eject build` to eject the overall build code.

It will copy the following file to your codebase.

~~~js
!INLINE ../plugins/build/runBuild.js
~~~

Run `$ reframe eject build-rendering` to eject `getPageHtmls()` to gain control over the static rendering.
(That is the rendering of pages to HTML that happens at build-time.
In other words, the HTML rendering of pages that have `renderHtmlAtBuildTime: true` in their page configs.)
Note that, most of the time, you should eject the renderer instead,
see [Custom Renderer](#custom-renderer).
Use this ejectable as last resort.

Run `$ reframe eject build-browser-entries` to eject `getPageBrowserEntries()` to gain control over the generation of the browser entry source code of each page.
Note that, most of the time, you should use the browser ejectables instead,
see the sections under "Custom > Browser".
Use this ejectable as last resort.

If you eject all build ejectables, then you have full control over the build logic.

!INLINE ./snippets/section-footer.md #custom --hide-source-path





