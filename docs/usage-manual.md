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
              src="https://github.com/reframejs/reframe/raw/master/docs/images/biceps.min.svg?sanitize=true"
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
              src="https://github.com/reframejs/reframe/raw/master/docs/images/chat.svg?sanitize=true"
              width="14"
              height="10"
            >
            Chat on Discord
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
    </sup>
</p>

[<p align="center"><img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.min.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/reframejs/reframe)

<div><p align="center">
        Framework to create web apps. The modern Django / Ruby on Rails.
</p></div>

<div><p align="center">
    <b>Rapid&nbsp;Dev</b>&nbsp;&#8209;&nbsp;Quickly&nbsp;implement&nbsp;apps.
    &nbsp; &nbsp; &nbsp;
    <b>Fully&nbsp;Flexible</b>&nbsp;&#8209;&nbsp;As&nbsp;flexible&nbsp;as&nbsp;using&nbsp;do-one-thing-do-it-well&nbsp;libraries.
</p></div>

<br/>

[Overview](/../../)<br/>
[**Usage Manual**](/docs/usage-manual.md)<br/>
[Plugins](/docs/plugins.md)

<br/>

# Usage Manual

#### Basics

 - [Getting Started](#getting-started--top)
 - [CSS & Static Assets](#css--static-assets--top)
 - [Data Loading](#data-loading--top)
 - [Page Navigation & Links](#page-navigation--links--top)
 - [`domStatic` & `htmlStatic`](#domstatic--htmlstatic--top)

#### Customization

 - Server
    - [Basic](#customization---server---basic--top)
    - [Full](#customization---server---full--top)

 - Rendering
    - [HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ...](#customization---rendering---html-head-meta-html---top)
    - [Renderer](#customization---rendering---renderer---top)

 - Browser
    - [Default Browser Entry](#customization---browser---default-browser-entry--top)
    - [Page Browser Entry](#customization---browser---page-browser-entry--top)
    - [Full](#customization---browser---full--top)

 - Routing
    - [Routing](#routing--top)

 - Build
    - [Webpack](#customization--build--webpack--top)
    - [Babel](#customization--build--babel--top)
    - [Full](#customization--build--full--top)

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





## Getting Started &nbsp; [<sub><sup>:top:</sup></sub>](#basics)

1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~

2. Initialize a new Rreframe app.
   ~~~shell
   $ reframe init my-app
   ~~~
   A `my-app/` directory is created and populated with a scaffold.

3. Build the pages and start the server.
   ~~~shell
   $ cd my-app
   $ reframe start
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

<br/>
<br/>





## CSS & Static Assets &nbsp; [<sub><sup>:top:</sup></sub>](#basics)

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
See [Customization - Webpack](#webpack) to customize the webpack config.

Example of a page loading and using CSS, fonts, images and static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>








## Data Loading &nbsp; [<sub><sup>:top:</sup></sub>](#basics)

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







## Page Navigation & Links &nbsp; [<sub><sup>:top:</sup></sub>](#basics)

The standard way to navigate between pages is to use the HTML link tag `<a>`.

See [Customization - Routing](#customadvanced-routing) for alternative ways of navigating.

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







## `domStatic` & `htmlStatic` &nbsp; [<sub><sup>:top:</sup></sub>](#basics)

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







## Customization - Server - Basic &nbsp; [<sub><sup>:top:</sup></sub>](#customization)

By default, Reframe creates a server with the web framework hapi ([hapijs.com](https://hapijs.com/)).

You can customize the hapi server by ejecting it with `$ reframe eject server`.

We encourage you to eject the server and you should if you want to
 - Add custom routes
 - Add API endpoints
 - Add authentication endpoints
 - Use a process manager such as PM2
 - etc.

See [Customization - Server - Advanced](#customization-server-basic) if you want to further customize the server.

Running `$ reframe eject server` will copy the following code to your codebase.

~~~js
// /plugins/hapi/start.js

const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: 3000,
        debug: {request: ['internal']},
    });

    // Run `$ reframe eject hapi` to eject the integration plugin.
    await server.register(config.hapiIntegrationPlugin);

    await server.start();

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
~~~

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>




## Customization - Server - Full &nbsp; [<sub><sup>:top:</sup></sub>](#customization)

###### Custom web framework

The code ejected by `$ reframe eject server`
creates the hapi server and adds a
hapi plugin that is responsible for the hapi <-> Reframe integration.
This plugin can be ejected with `$ reframe eject server-integration`.
Ejecting it is uncommon and chances are that you will never have to.
But if you want to use another web framework instead of hapi then you'll need to eject it.

###### Full control

The server-side rendering (the dynamic generation of the pages' HTMLs)
and the serving of static browser assets (JavaScript files, CSS files, images, fonts, etc.)
are implemented by the `@reframe/server` plugin.
The plugin is agnostic and can be used with any web framework.

You can take full control the server-side rendering by running `$ reframe eject server-rendering`.

And you can take full control over the static assets servering by running `$ reframe eject server-assets`.

If you eject all server ejectables then every server LOC is in your codebase and you have full control over the server logic.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>





## Webpack &nbsp; [<sub><sup>:top:</sup></sub>](#customization)

Save a `reframe.config.js` file at your app's root directory and use the `webpackBrowserConfig` and/or `webpackNodejsConfig` configurations.

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

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






## Babel &nbsp; [<sub><sup>:top:</sup></sub>](#customization)

You can customize the babel config by creating a `.babelrc` file.

Example:
 - [/examples/custom-babel](/examples/custom-babel)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>






## Customization - Rendering - HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ... &nbsp; [<sub><sup>:top:</sup></sub>](#customization)

Reframe uses [`@brillout/index-html`](https://github.com/brillout/index-html) to generate HTML.

You have full control over the "outer-part" HTML.
(`<meta>`, `<!DOCTYPE html`>, `<head>`, `<html>`, `<body>`, `<script>`, etc.)

There are two ways to define the outer-part HTML:
 - By creating a `index.html` file
 - Over the page configs

Over the page config:

~~~js
// /examples/custom-head/pages/landing.config.js

import React from 'react';

export default {
    // Add <title>Welcome<title>
    title: 'Welcome',

    // Add <meta name="description" content="A welcome page.">
    description: 'A welcome page.',

    // Add <script src="https://example.org/awesome-lib.js" type="text/javascript"></script>
    scripts: [
        'https://example.org/awesome-lib.js',
    ],

    // Add <link href="https://example.org/awesome-lib.css" rel="stylesheet">
    styles: [
        'https://example.org/awesome-lib.css',
    ],

    // ...
    // ...
    // Every `@brillout/index-html` option is available over the page config
    // ...
    // ...

    route: '/',
    view: () => <h1>Welcome</h1>,
    domStatic: true,
};
~~~

Over a `index.html` file saved in your app's root directory:

~~~js
// /examples/custom-head/index.html

<!DOCTYPE html>
<html>
    <head>
        <link rel="manifest" href="/manifest.json">
        !HEAD
    </head>
    <body>
        !BODY
        <script src="https://example.org/some-lib.js" type="text/javascript"></script>
    </body>
</html>
~~~

Also, the `indexHtml` page config option allows you to override the `index.html` file for a specific page:

~~~js
// /examples/custom-head/pages/about.config.js

import React from 'react';

export default {
    // Set a different outer-part HTML for the `/about` page
    indexHtml: (
`<!DOCTYPE html>
<html>
    <head>
        <title>About</title>
        !HEAD
    </head>
    <body>
        !BODY
    </body>
</html>
`
    ),

    route: '/about',
    view: () => <h1>About Page</h1>,
    domStatic: true,
};
~~~

All `@brillout/index-html` options are available over the page config.

See [`@brillout/index-html`'s documentation](https://github.com/brillout/index-html).

Example:
 - [/examples/custom-head](/examples/custom-head)

If you want to use something else than `@brillout/index-html`, then you can eject the renderer.
See the [Customization - Rendering - Renderer](#customization-rendering-renderer) section.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>




## Customization - Rendering - Renderer &nbsp; [<sub><sup>:top:</sup></sub>](#customization)

By default Reframe renders the `view` property of your page configs with React.

But you can fully customize how your views are rendered.

Either use another plugin in the [list of renderer plugins](/docs/plugins.md#renderers) or eject the renderer with `$ reframe eject renderer`.

When ejecting the renderer, you have full control over the rendering of your views.

Ejecting the React renderer will copy the following code to your codebase.

~~~js
// /plugins/react/renderToHtml.js

const React = require('react');
const ReactDOMServer = require('react-dom/server');
const generateHtml = require('@brillout/index-html');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {CONTAINER_ID, getReactElement} = require('./common');

module.exports = renderToHtml;

async function renderToHtml({pageConfig, initialProps}) {
    const reactElement = getReactElement({
        pageConfig,
        initialProps,
        viewWrappers: config.nodejsViewWrappers,
    });

    const contentHtml = ReactDOMServer.renderToStaticMarkup(reactElement);

    const html = renderHtmlDocument(contentHtml, pageConfig);

    return html;
}

function renderHtmlDocument(contentHtml, pageConfig) {
    const htmlOptions = Object.assign({bodyHtmls: []}, pageConfig);
    htmlOptions.bodyHtmls.push('<div id="'+CONTAINER_ID+'">'+contentHtml+'</div>');

    const html = generateHtml(htmlOptions);

    return html;
}
~~~
~~~js
// /plugins/react/renderToDom.js

const ReactDOM = require('react-dom');
const browserConfig = require('@brillout/browser-config');
const {CONTAINER_ID, getReactElement} = require('./common');

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    const reactElement = getReactElement({
        pageConfig,
        initialProps,
        viewWrappers: browserConfig.browserViewWrappers,
    });

    const container = document.getElementById(CONTAINER_ID);

    ReactDOM.hydrate(reactElement, container);
}
~~~
~~~js
// /plugins/react/common.js

const React = require('react');

module.exports = {
    CONTAINER_ID: 'root-react',
    getReactElement,
};

function getReactElement({pageConfig, initialProps, viewWrappers}) {
    let reactElement = React.createElement(pageConfig.view, initialProps);
    reactElement = applyViewWrappers({reactElement, initialProps, viewWrappers});
    return reactElement;
}

// Apply view wrappers.
// E.g. the `@reframe/react-router` plugin adds a view wrapper to add
// the provider-components `<BrowserRouter>` and `<StaticRouter>`.
function applyViewWrappers({reactElement, initialProps, viewWrappers=[]}) {
    viewWrappers
    .forEach(viewWrapper => {
        reactElement = viewWrapper(reactElement, initialProps);
    });
    return reactElement;
}
~~~



## Customization - Browser - Default Browser Entry

You can customize the browser entry code by running `$reframe eject browser`.

We encourage you to do so and you should if you want to:
  - Initialize user tracking such as Google Analytics
  - Initialize error tracking such as Sentry
  - etc.

Running `$reframe eject browser` ejects the following code.

~~~js
// /plugins/browser/browserEntry.js

import browserConfig from '@brillout/browser-config';

initBrowser();

async function initBrowser() {
    await browserConfig.hydratePage();
}
~~~

## Customization - Browser - Page Browser Entry

You can customize the browser entry code for a single page
without affecting the browser entry code of the other pages.

You do this by setting the page config option `browserEntry`.
For example:

~~~js
// /examples/custom-browser/pages/custom-hydration.config.js

import React from 'react';
import TimeComponent from '../../basics/views/TimeComponent';

export default {
    route: '/custom-hydration',
    browserEntry: {
        pathToEntry: './custom-hydration.js',
        doNotIncludePageConfig: true,
        doNotInlcudeBrowserConfig: true,
    },
    view: () => (
        <div>
            <div>
                Some static stuff.
            </div>
            <div>
                Current Time:
                <span id="time-hook">
                    <TimeComponent/>
                </span>
            </div>
        </div>
    ),
};
~~~

You can see the example in full and other examples at [/examples/custom-browser](/examples/custom-browser).

## Customization - Browser - Full

You can as well eject the code that orchestrates the hydration of the page by running `$ reframe eject browser-hydration`.
Note that if you want to customize the rendering process itself you should run `$ reframe eject renderer` instead.

You can also eject the code that generates the browser entry for each page when building by running `$ reframe eject build-entries`.




## Routing

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








## Customization - Build - Full

Run `reframe eject build` to eject the overall build code.

It will copy the following file to your codebase.

~~~js
// /plugins/build/executeBuild.js

const Build = require('webpack-ssr/Build');
const watchDir = require('webpack-ssr/watchDir');

const projectConfig = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});

const outputDir = projectConfig.projectFiles.buildOutputDir;
const getPageFiles = () => projectConfig.getPageConfigFiles();
const getWebpackBrowserConfig = ({config, ...utils}) => projectConfig.webpackBrowserConfigModifier({config, ...utils});
const getWebpackNodejsConfig = ({config, ...utils}) => projectConfig.webpackNodejsConfigModifier({config, ...utils});
const {log, doNotWatchBuildFiles} = projectConfig;
const {pagesDir} = projectConfig.projectFiles;
const {getPageHtmls, getPageBrowserEntries} = projectConfig;

const build = new Build({
    outputDir,
    getPageFiles,
    getPageBrowserEntries,
    getPageHtmls,
    getWebpackBrowserConfig,
    getWebpackNodejsConfig,
    log,
    doNotWatchBuildFiles,
});

watchDir(pagesDir, () => {build()});

module.exports = build();
~~~

Run `reframe eject build-static-rendering` to eject `getPageHtmls()` to gain control over the HTML rendering of your HTML-static pages. (That is pages with `htmlStatic: true` in their page configs.)

And run `reframe eject build-browser-entries` to eject `getPageBrowserEntries()` to gain control over the browser entry code of your pages.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>







## Static Deploy &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

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

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>




## Serverless Deploy &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

If your app is stateless we then recommand serverless deployment.

Serverless deployment solutions:
 - [Up](https://github.com/apex/up) - CLI tool to manage serverless deployement on AWS.
 - [Now](https://zeit.co/now) - Serverless host.

If you want to persist data, you may consider using a cloud database.
 - [List of cloud databases](/docs/cloud-databases.md)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>




## Vue &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

You can also use Reframe with Vue instead of React.

Check out the [`@reframe/vue`](/plugins/vue) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>

## React Router &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

You can use the React Router components by adding the [@reframe/react-router](/plugins/react-router) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>

## TypeScript &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

You can write your app with TypeScript by adding the [@reframe/typescript](/plugins/typescript) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>

## PostCSS &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

You can write your styles with PostCSS by adding the [@reframe/postcss](/plugins/postcss) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).

<br/>
<br/>




## React Native (Web) &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

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






## React Native (Web) + React Router &nbsp; [<sub><sup>:top:</sup></sub>](#use-cases)

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
