<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.






-->
<p align="right">
    <sup>
        <a href="#">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/star.svg?sanitize=true"
              width="16"
              height="12"
            >
        </a>
        Star if you like
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://github.com/reframejs/reframe/blob/master/docs/contributing.md">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/muscle.png?sanitize=true"
              width="16"
              height="14"
            >
            Co-maintain Reframe
        </a>
    </sup>
    <br/>
    <sup>
        <a href="https://twitter.com/reframejs">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/twitter-logo.svg?sanitize=true"
              width="15"
              height="13"
            >
            Follow on Twitter
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://discord.gg/kqXf65G">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/online-icon.svg?sanitize=true"
              width="14"
              height="10"
            >
            Chat on Discord
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
    </sup>
</p>

[<p align="center"><img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/reframejs/reframe)

<div><p align="center">
        Framework to create web apps with React
</p></div>

<div><p align="center">
    <b>Easy</b>
    &nbsp;-&nbsp;
    Create apps with page configs
    &nbsp;&nbsp;
    &nbsp;&nbsp;
    <b>Progressive Eject</b>
    &nbsp;-&nbsp;
    No lock-in
    &nbsp;&nbsp;
    &nbsp;&nbsp;
    <b>Universal</b>
    &nbsp;-&nbsp;
    Create static and dynamic apps
</p></div>

<br/>

[Overview](/../../)<br/>
[**Usage Manual**](/docs/usage-manual.md)<br/>
[Plugins](/docs/plugins.md)

<br/>

# Usage Manual

#### Contents

###### Basics

 - [Getting Started](#getting-started)
 - [CSS & Static Assets](#css--static-assets)
 - [Data Loading](#data-loading)
 - [Page Navigation & Links](#page-navigation--links)
 - [`domStatic` & `htmlStatic`](#domstatic--htmlstatic)

###### Customization & Eject

 - [Custom/Eject Server](#customeject-server)
 - [Custom Webpack](#custom-webpack)
 - [Custom Babel](#custom-babel)
 - [Custom &lt;head&gt;, &lt;script&gt;, ...](#custom-head-script-)
 - [Custom/Advanced Routing](#customadvanced-routing)
 - [Custom/Eject Build](#customeject-build)
<!--- TODO
 - [Custom Error Pages (404, 5xx, ...)](#custom-error-pages-404-5xx-)
 - [Custom/Eject Browser Code](#customeject-browser-code)
-->

###### Use Cases

 - [Static Deploy](#static-deploy)
 - [Vue](#vue)
 - [React Native (Web)](#react-native-web)
 - [React Native (Web) + React Router](#react-native-web--react-router)


<br/>
<br/>





## Getting Started

1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~

2. Initialize a new Rreframe app.
   ~~~shell
   $ reframe init my-app
   ~~~
   A `my-app/` directory is created and populated with a Reframe app scaffold.

3. Build the pages and start the server.
   ~~~shell
   $ cd my-app
   $ reframe start
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

<br/>
<br/>





## CSS & Static Assets

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

CSS and static assets are handled by webpack.
See [Custom Webpack](#custom-webpack) to customize the webpack config.

Example of a page loading and using CSS, fonts, images and static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>








## Data Loading

A page config can be set a function `async getInitialProps()` that Reframe calls every time before the view is rendered.
(On both the server and in the browser.)
By using `async getInitialProps()` you can fetch data required by your page's React components.

For example:

~~~js
// /examples/basics/pages/got/GameOfThronesPage.config.js

import React from 'react';
import getCharacters from './data/getCharacters';
import CharacterList from './views/CharacterList';

export default {
    route: '/game-of-thrones',

    // Everything returned in `getInitialProps()` is passed to the props of the view
    getInitialProps: async () => {
        const characters = await getCharacters();
        return {characters};
    },

    // Our data is available at `props.characters`
    view: props => <CharacterList characters={props.characters}/>,

    domStatic: true,
};
~~~

Alternatively, you can fetch data in a stateful component.
But in that case the data will not be rendered to HTML.

Deeper explanation and example of pages loading data:
 - [/examples/basics/pages/got/](/examples/basics/pages/got/)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>







## Page Navigation & Links

The standard way to navigate between pages is to use the HTML link tag `<a>`.

See [Custom/Advanced Routing](#customadvanced-routing) for alternative ways of navigating.

Example:

~~~js
import React from 'react';

export default {
    route: '/page-a',
    view: () =>
        <div>
            This is page A.
            <a href='/page-b'>Page B</a>.
        </div>,
};
~~~
~~~js
import React from 'react';

export default {
    route: '/page-b',
    view: () =>
        <div>
            This is page B.
            <a href='/page-a'>Page A</a>.
        </div>,
};
~~~

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>







## `domStatic` & `htmlStatic`

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

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>







## Custom/Eject Server

Running the command

~~~shell
$ reframe eject server
~~~

will copy the following file to your codebase.

~~~js
// /plugins/server/startServer.js

const Hapi = require('hapi');
const HapiPluginServerRendering = require('./HapiPluginServerRendering');
const HapiPluginStaticAssets = require('./HapiPluginStaticAssets');
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = startServer();

async function startServer() {
    // By default, Reframe uses the hapi framework (https://hapijs.com/) to create a server.
    // You can as well use Reframe with another server framework such as Express.
    const server = Hapi.Server({
        port: 3000,
        debug: {request: ['internal']},
    });

    await server.register([
        // This plugin serves all static assets such as JavaScript, (static) HTMLs, images, etc.
        // Run `reframe eject server-assets` to customize this plugin.
        HapiPluginStaticAssets,
        // This plugin serves the dynamic HTMLs.
        // Run `reframe eject server-ssr` to customize this plugin.
        HapiPluginServerRendering,
    ]);

    await server.start();

    console.log([
        symbolSuccess,
        'Server running ',
        '(for '+colorEmphasis(process.env.NODE_ENV||'development')+')',
    ].join(''));

    return server;
}
~~~

At this point you can:
 - Add custom routes
 - Add API endpoints
 - Add authentication endpoints
 - Use another server framework such as Express
 - Use a process manager such as PM2

The following command ejects the `HapiPluginServerRendering` plugin to gain control over the Server Side Rendering (the dynamic generation of the pages' HTML)

~~~shell
$ reframe eject server-rendering
~~~

And run

~~~shell
$ reframe eject server-assets
~~~

to eject the `HapiPluginStaticAssets` plugin and to gain control over the serving of static browser assets. (JavaScript files, CSS files, images, fonts, etc.)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>




## Custom Webpack

Save a `reframe.config.js` file at your app root directory and use the `webpackBrowserConfig` and/or `webpackNodejsConfig` Reframe configs.

~~~js
// reframe.config.js

module.exports = {
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

Docs of the `@brillout/webpack-config-mod` config modifiers at [/helpers/webpack-config-mod](/helpers/webpack-config-mod).

Examples:
 - Using modifiers [/examples/custom-webpack](/examples/custom-webpack)
 - Fully custom config [/examples/custom-webpack-full](/examples/custom-webpack-full)
 - Source code of [`@reframe/postcss`](/plugins/postcss)
 - Source code of [`@reframe/react`](/plugins/react)
 - Source code of [`@reframe/typescript`](/plugins/typescript)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






## Custom Babel

You can customize the babel config by creating a `.babelrc` file.

Example:
 - [/examples/custom-babel](/examples/custom-babel)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






## Custom &lt;head&gt;, &lt;script&gt;, ...

Reframe handles the outer part of HTML (including `<head>`, `<!DOCTYPE html`>, `<script>`, etc.) with `@brillout/html-crust`.

All options of `@brillout/html-crust` are available over the page config.
Thus, the page config has full control over the outer part of HTML including the `<head>`.

We refer to [`@brillout/html-crust`'s documentation](https://github.com/brillout/html-crust) for further information.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>


<!--- TODO
## Custom/Eject Browser Code

TODO
-->







## Custom/Advanced Routing

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

###### Custom router

Reframe can be used with any routing library.

It can, for example, be used with [Crossroads.js](https://github.com/millermedeiros/crossroads.js).

We refer to the source code of the plugin [`@reframe/crossroads`](/plugins/crossroads) for further information about how to use Reframe with another routing library.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>



<!--- TODO
## Custom Error Pages (404, 5xx, ...)

TODO

A 404 page can be implemented by using a catch-all route:

~~~js
import React from 'react';

export default {
    route: '/:params*',
    title: 'Not Found',
    view: props => (
        <div>
            The page {props.route.url.pathname} does not seem to exist.
        </div>
    ),
};
~~~
-->






## Custom/Eject Build

Run `reframe eject build` to eject the overall build code.

It will copy the following file to your codebase.

~~~js
// /plugins/build/executeBuild.js

const getProjectConfig = require('@reframe/utils/getProjectConfig');

const Build = require('webpack-ssr/Build');
const watchDir = require('webpack-ssr/watchDir');

const getPageBrowserEntries = require('./getPageBrowserEntries');
const getPageHTMLs = require('./getPageHTMLs');

const projectConfig = getProjectConfig();
const outputDir = projectConfig.projectFiles.buildOutputDir;
const getPageFiles = () => projectConfig.getPageConfigFiles();
const getWebpackBrowserConfig = ({config, ...utils}) => projectConfig.webpackBrowserConfigModifier({config, ...utils});
const getWebpackNodejsConfig = ({config, ...utils}) => projectConfig.webpackNodejsConfigModifier({config, ...utils});
const {log, doNotWatchBuildFiles} = projectConfig;
const {pagesDir} = projectConfig.projectFiles;

const build = new Build({
    outputDir,
    getPageFiles,
    getPageBrowserEntries,
    getPageHTMLs,
    getWebpackBrowserConfig,
    getWebpackNodejsConfig,
    log,
    doNotWatchBuildFiles,
});

watchDir(pagesDir, () => {build()});

module.exports = build();
~~~

Run `reframe eject build-static-rendering` to eject `getPageHTMLs()` to gain control over the HTML rendering of your HTML-static pages. (That is pages with `htmlStatic: true` in their page configs.)

And run `reframe eject build-browser-entries` to eject `getPageBrowserEntries()` to gain control over the browser entry code of your pages.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>







## Static Deploy

If you add `htmlStatic: true` to all your page configs,
then all HTMLs are rendered at build-time,
no Node.js server is required,
and your app can be deployed to a static website host
such as [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/).

Your app then consists of static assets only.
The static assets are located in the `dist/browser/` directory.
(The `dist/` directory is located at your app's root directory.)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






## Vue

You can also use Reframe with Vue instead of Reframe.

Check out the [`@reframe/vue`](/plugins/vue) plugin.

Example:
 - [/plugins/vue/example](/plugins/vue/example)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






## React Native (Web)

If you want an app on the web and on mobile,
you may consider create a web app with Reframe and [React Native Web](https://github.com/necolas/react-native-web)
and a mobile app with [React Native](https://facebook.github.io/react-native/).
Both app will then share most/lots of code.

Add the [`@reframe/react-native-web`](/plugins/react-native-web) plugin to render your page's React components with React Native Web.

Examples of apps using Reframe + RNW:
 - [/plugins/react-native-web/example](/plugins/react-native-web/example)
 - [/examples/react-native-web-and-react-router](/examples/react-native-web-and-react-router)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






## React Native (Web) + React Router

As mentioned in the previous section you can use Reframe + React Native Web to share code with your React Native mobile app.

And you can share routing logic by using Reframe + React Native Web + [React Router Web](https://reacttraining.com/react-router/web) for your web app and React Native + [React Router Native](https://reacttraining.com/react-router/native) for your mobile app.

For example:
 - [/examples/react-native-web-and-react-router](/examples/react-native-web-and-react-router)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.






-->
