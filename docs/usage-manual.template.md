!INLINE ./links.md --hide-source-path
!INLINE ./header.md --hide-source-path

!MENU
!MENU_ORDER 20

<br/>

# Usage Manual

#### Basics

- [Getting Started](#getting-started--top)<br>
- [CSS & Static Assets](#css--static-assets--top)<br>
- [Data Loading](#data-loading--top)<br>
- [Page Navigation & Links](#page-navigation--links--top)<br>
- [`domStatic` & `htmlStatic`](#domstatic--htmlstatic--top)<br>

#### Custom

- Server
  - [Custom Server](#custom-server--top)
  - [Fully Custom Server](#fully-custom-server--top)
- Rendering
  - [Custom HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ...](#custom-html-head-meta-html---top)
  - [Custom Renderer](#custom-renderer--top)
- Browser
  - [Custom Default Browser Entry](#custom-default-browser-entry--top)
  - [Custom Page Browser Entry](#custom-page-browser-entry--top)
  - [Fully Custom Browser Entry](#fully-custom-browser-entry--top)
- Routing
  - [Advanced Routing](#advanced-routing--top)
  - [Custom Router](#custom-router--top)
- Build
  - [Custom Babel](#custom-babel--top)
  - [Custom Webpack](#custom-webpack--top)
  - [Fully Custom Build](#fully-custom-build--top)

#### Use Cases

- Deploy
  - [Static Deploy](#static-deploy--top)
  - [Serverless Deploy](#serverless-deploy--top)
- Integrations
  - [Vue](#vue--top)
  - [React Router](#react-router--top)
  - [TypeScript](#typescript--top)
  - [PostCSS](#postcss--top)
  - [React Native (Web)](#react-native-web--top)
  - [React Native (Web) + React Router](#react-native-web--react-router--top)


<br/>
<br/>





## Getting Started !INLINE ./top-link.md #basics

!INLINE ./start.md --hide-source-path

<br/>
<br/>





## CSS & Static Assets !INLINE ./top-link.md #basics

A CSS file can be loaded and applied by importing it.

~~~js
import './GlitterStyle.css';
~~~

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

Example of a page loading and using CSS, fonts, images and static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)

!INLINE ./help.md --hide-source-path








## Data Loading !INLINE ./top-link.md #basics

The page config `async getInitialProps()` can be used to fetch data before your page's view is rendered.
The value returned by `async getInitialProps()` is then available to your page's view.

For example:

~~~js
!INLINE ../examples/basics/pages/got/GameOfThronesPage.config.js
~~~

Alternatively, you can fetch data in a stateful component.
But in that case the data will not be rendered to HTML.

Deeper explanation and example of pages loading data:
 - [/examples/basics/pages/got/](/examples/basics/pages/got/)

!INLINE ./help.md --hide-source-path







## Page Navigation & Links !INLINE ./top-link.md #basics

The standard way to navigate between pages is to use the HTML link tag `<a>`.

See [Advanced Routing](#advanced-routing--top) for alternative ways of navigating.

Example:

~~~js
!INLINE ../examples/basics/pages/page-a.config.js --hide-source-path
~~~
~~~js
!INLINE ../examples/basics/pages/page-b.config.js --hide-source-path
~~~

!INLINE ./help.md --hide-source-path







## `domStatic` & `htmlStatic` !INLINE ./top-link.md #basics

By default, a page is rendered twice:
On the server (to HTML) and in the browser (to the DOM).
(React components can be rendered to the DOM as well as to HTML.)

A page can be "DOM-dynamic" or "DOM-static" and "HTML-dynamic" or "HTML-static".

 - **_HTML-static_**
   <br/>
   The page is rendered to **HTML at build-time**.
   <br/>
   (The page is rendered to HTML only once, when Reframe is building your app's pages.)
   <br/>
   Add `htmlStatic: true` to the page config.
 - **_HTML-dynamic_**
   <br/>
   The page is rendered to **HTML at request-time**.
   <br/>
   (The page is (re-)rendered to HTML every time the user requests the page.)
   <br/>
   Default setting.
 - **_DOM-static_**
   <br/>
   The page is **not rendered in the browser**.
   <br/>
   (The DOM will not change since the page is not rendered to the DOM.)
   <br/>
   Add `domStatic: true` to the page config.
 - **_DOM-dynamic_**
   <br/>
   The page **is rendered in the browser**.
   <br/>
   (The DOM may eventually change since the page is rendered to the DOM.)
   <br/>
   Default setting.

Because it is rendered in the browser, a page can have interactive views
(a like button, an interactive graph, a To-Do list, etc.).
But if a page has no interactive views then it is wasteful to render it in the browser.
By adding `domStatic: true` to its page config, the page is only rendered on the server and not in the browser.
The browser loads no (or almost no) JavaScript and the DOM is static.

By default a page is rendered to HTML at request-time.
But if a page is static
(a landing page, a blog post, a personal homepage, etc.) it would be wasteful to re-render its HTML on every page request.
By adding `htmlStatic: true` to its page config, the page is rendered to HTML at build-time instead.

!INLINE ./help.md --hide-source-path








## Custom Server !INLINE ./top-link.md #custom

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

!INLINE ./help.md --hide-source-path







## Fully Custom Server !INLINE ./top-link.md #custom

###### Custom web framework

The code ejected by `$ reframe eject server`
creates the hapi server and adds a
hapi plugin that is responsible for the hapi <-> Reframe integration.
This plugin can be ejected with `$ reframe eject server-integration`.
Ejecting it is uncommon and chances are that you will never have to.
But if you want to use another web framework instead of hapi then you may want to eject it.

###### Full control

The server-side rendering (the generation of the pages' HTMLs at request-time)
and the serving of static browser assets (JavaScript files, CSS files, images, fonts, etc.)
are implemented by the `@reframe/server` plugin.
The plugin is agnostic and can be used with any web framework.

You can take control over the server-side rendering by running `$ reframe eject server-rendering`.

And you can take control over the static assets servering by running `$ reframe eject server-assets`.

If you eject all server ejectables then every server LOC is in your codebase and you have full control over the server logic.

!INLINE ./help.md --hide-source-path









## Custom HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ... !INLINE ./top-link.md #custom

Reframe uses [`@brillout/index-html`](https://github.com/brillout/index-html) to generate HTML.

You have full control over the "outer-part" HTML.
(`<meta>`, `<!DOCTYPE html`>, `<head>`, `<html>`, `<body>`, `<script>`, etc.)

There are two ways to change the outer-part HTML:
 - By creating a `index.html` file
 - Over the page config

Over the page config:

~~~js
!INLINE ../examples/custom-head/pages/landing.config.js
~~~

Over a `index.html` file saved in your app's root directory:

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
see [Custom Renderer](#custom-renderer--top).

!INLINE ./help.md --hide-source-path







## Custom Renderer !INLINE ./top-link.md #custom

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

!INLINE ./help.md --hide-source-path







## Custom Default Browser Entry !INLINE ./top-link.md #custom

You can customize the browser entry code by running `$reframe eject browser`.

We encourage you to do so and you should if you want to:
  - Initialize user tracking such as Google Analytics
  - Initialize error tracking such as Sentry
  - etc.

Running `$reframe eject browser` ejects the following code.

~~~js
!INLINE ../plugins/browser/browserEntry.js
~~~

!INLINE ./help.md --hide-source-path






## Custom Page Browser Entry !INLINE ./top-link.md #custom

You can customize the browser entry code for a single page
without affecting the browser entry code of other pages.

You do this by setting the page config `browserEntry`.
For example:

~~~js
!INLINE ../examples/custom-browser/pages/custom-hydration.config.js
~~~

~~~js
!INLINE ../examples/custom-browser/pages/custom-hydration.js
~~~

You can see the example in full and other examples at [/examples/custom-browser](/examples/custom-browser).

!INLINE ./help.md --hide-source-path






## Fully Custom Browser Entry !INLINE ./top-link.md #custom

You can as well eject the code that orchestrates the hydration of the page by running `$ reframe eject browser-hydration`.
Note that
if you want to customize the rendering process itself
you should run `$ reframe eject renderer` instead,
see [Custom Renderer](#custom-renderer--top).

Note that the browser entry of each page are generated at build-time.
You can take control over the generation of browser entries by running `$ reframe eject build-browser-entries`.
We recommand to use the previously mentioned ejectables instead.
Use this ejectable as last resort.

!INLINE ./help.md --hide-source-path






## Advanced Routing !INLINE ./top-link.md #custom

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






## Custom Router !INLINE ./top-link.md #custom

Reframe can be used with any routing library.

Either use another plugin in the [list of router plugins](/docs/plugins.md#routers) or eject the router with `$ reframe eject router`.

!INLINE ./help.md --hide-source-path






## Custom Babel !INLINE ./top-link.md #custom

You can customize the babel config by creating a `.babelrc` file.

Example:
 - [/examples/custom-babel](/examples/custom-babel)

!INLINE ./help.md --hide-source-path






## Custom Webpack !INLINE ./top-link.md #custom

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

!INLINE ./help.md --hide-source-path






## Fully Custom Build !INLINE ./top-link.md #custom

Run `$ reframe eject build` to eject the overall build code.

It will copy the following file to your codebase.

~~~js
!INLINE ../plugins/build/executeBuild.js
~~~

Run `$ reframe eject build-rendering` to eject `getPageHtmls()` to gain control over the static rendering.
(That is the rendering of pages to HTML that happens at build-time.
In other words, the HTML rendering of pages that have `htmlStatic: true` in their page configs.)
Note that, most of the time, you should eject the renderer instead,
see [Custom Renderer](#custom-renderer--top).
Use this ejectable as last resort.

Run `$ reframe eject build-browser-entries` to eject `getPageBrowserEntries()` to gain control over the generation of the browser entry source code of each page.
Note that, most of the time, you should use the browser ejectables instead,
see the sections under "Custom > Browser".
Use this ejectable as last resort.

If you eject all build ejectables, then you have full control over the build logic.

!INLINE ./help.md --hide-source-path







## Static Deploy !INLINE ./top-link.md #use-cases

If you are app is html-static, you can deploy it to a static host.

The `$ reframe deploy-static` command will automatically deploy your app.
It works with any static host that integrates with Git such as
[Netlify](https://www.netlify.com/) or
[GitHub Pages](https://pages.github.com/).

Your app is html-static when all your page configs have `htmlStatic: true`.
In that case,
all HTMLs are rendered at build-time,
your app consists of static assets only,
no Node.js server is required,
and your app can be statically deployed.

The static assets are located in the `dist/browser/` directory.

!INLINE ./help.md --hide-source-path




## Serverless Deploy !INLINE ./top-link.md #use-cases

If your app is stateless we then recommand serverless deployment.

Serverless deployment solutions:
 - [Up](https://github.com/apex/up) - CLI tool to manage serverless deployement on AWS.
 - [Now](https://zeit.co/now) - Serverless host.

A step-by-step guide on how to deploy a Reframe app on Up can be found [here](https://github.com/AurelienLourot/reframe-on-up).

If you want to persist data, you may consider using a cloud database.
 - [List of cloud databases](/docs/cloud-databases.md)

!INLINE ./help.md --hide-source-path




## Vue !INLINE ./top-link.md #use-cases

You can also use Reframe with Vue instead of React.

Check out the [`@reframe/vue`](/plugins/vue) plugin.

!INLINE ./help.md --hide-source-path

## React Router !INLINE ./top-link.md #use-cases

You can use the React Router components by adding the [@reframe/react-router](/plugins/react-router) plugin.

!INLINE ./help.md --hide-source-path

## TypeScript !INLINE ./top-link.md #use-cases

You can write your app with TypeScript by adding the [@reframe/typescript](/plugins/typescript) plugin.

!INLINE ./help.md --hide-source-path

## PostCSS !INLINE ./top-link.md #use-cases

You can write your styles with PostCSS by adding the [@reframe/postcss](/plugins/postcss) plugin.

!INLINE ./help.md --hide-source-path




## React Native (Web) !INLINE ./top-link.md #use-cases

If you want an app on the web and on mobile,
you may consider create a web app with Reframe and [React Native Web](https://github.com/necolas/react-native-web)
and a mobile app with [React Native](https://facebook.github.io/react-native/).
Both app will then share most/lots of code.

Add the [`@reframe/react-native-web`](/plugins/react-native-web) plugin to render your page's React components with React Native Web.

Examples of apps using Reframe + RNW:
 - [/plugins/react-native-web/example](/plugins/react-native-web/example)
 - [/examples/react-native-web-and-react-router](/examples/react-native-web-and-react-router)

!INLINE ./help.md --hide-source-path






## React Native (Web) + React Router !INLINE ./top-link.md #use-cases

As mentioned in the previous section you can use Reframe + React Native Web to share code with your React Native mobile app.

And you can share routing logic by using Reframe + React Native Web + [React Router Web](https://reacttraining.com/react-router/web) for your web app and React Native + [React Router Native](https://reacttraining.com/react-router/native) for your mobile app.

For example:
 - [/examples/react-native-web-and-react-router](/examples/react-native-web-and-react-router)

!INLINE ./help.md --hide-source-path





