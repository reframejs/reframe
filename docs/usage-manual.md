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
<a href="https://github.com/reframejs/reframe">
    <img align="left" src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.min.svg?sanitize=true" width=399 height=79 style="max-width:100%;" alt="Reframe"/>
</a>
<br/>
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

&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Introduction](/../../)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Starters](/docs/starters.md)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [**Usage Manual**](/docs/usage-manual.md)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Concepts](/docs/concepts.md)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Plugins](/docs/plugins.md)

<br/>

# Usage Manual

#### Basics

- [Getting Started](#getting-started)
- [CSS & Static Assets](#css--static-assets)
- [Page Async Data](#page-async-data)
- [Page Navigation & Links](#page-navigation--links)
- [`doNotRenderInBrowser`](#donotrenderinbrowser)
- [`renderHtmlAtBuildTime`](#renderhtmlatbuildtime)

#### Custom

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

#### Use Cases

- Deploy
  - [Static Deploy](#static-deploy)
  - [Serverless Deploy](#serverless-deploy)
- Integrations
  - [Vue](#vue)
  - [React Router](#react-router)
  - [TypeScript](#typescript)
  - [PostCSS](#postcss)
  - [React Native (Web)](#react-native-web)
  - [React Native (Web) + React Router](#react-native-web--react-router)
  - [Frontend Libraries](#frontend-libraries)


<br/>
<br/>





## Getting Started

1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~

2. Create a new Reframe app.
   ~~~shell
   $ reframe create react-frontend
   ~~~
   A `my-reframe-app/` directory is created and populated with the !ARGUMENT-1 starter.

3. Build and serve the app.
   ~~~shell
   $ cd my-reframe-app/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. **Read the entire [Usage Basics](/plugins/create/starters/react-frontend#react-frontend) section of the react-frontend starter**.

We recommand the react-frontend starter for you first Reframe app.
But you can also pick another starter from the [list of starters](/docs/starters.md).

<b><sub><a href="#basics">&#8679; TOP &#8679;</a></sub></b>
<br/>
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

Example of a page using CSS, fonts, images and other static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#basics">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






## Page Async Data

The page config `async getInitialProps()` can be used to fetch data before your page's view is rendered.
The value returned by `async getInitialProps()` is then available to your page's view.

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

    doNotRenderInBrowser: true,
};
~~~

Alternatively, you can fetch data in a stateful component.
But in that case the data will not be rendered to HTML.

Deeper explanation and further examples of pages asynchronously loading data:
 - [/examples/basics/pages/got/](/examples/basics/pages/got/)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#basics">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>





## Page Navigation & Links

The standard way to navigate between pages is to use the HTML link tag `<a>`.

See [Advanced Routing](#advanced-routing) for alternative ways of navigating.

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
<b><sub><a href="#basics">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>







## `doNotRenderInBrowser`

The page config option `doNotRenderInBrowser` allow you to control whether or not the page is rendered in the browser.

By default a page is rendered in the browser so that it can have interactive views
(a like button, an interactive graph, a To-Do list, etc.).
But if a page has no interactive views then it is wasteful to render it in the browser.

 - `doNotRenderInBrowser: false` (default value)
   <br/>
   The page is **rendered in the browser**.
   <br/>
   The page's view (e.g. React components) and the view renderer (e.g. React) are loaded in the browser.
   <br/>
   The page's view is rendered to the DOM.
   (E.g. with `ReactDOM.hydrate`.)
   <br/>
   The DOM may change.
 - `doNotRenderInBrowser: true`
   <br/>
   The page is **not rendered in the browser**.
   <br/>
   No JavaScript (or much less JavaScript) is loaded in the browser.
   <br/>
   The DOM will not change.

Setting `doNotRenderInBrowser: true` makes the page considerably faster as no (or much less) JavaScript is loaded and exectued.

So if your page has no interactive views, then you should set `doNotRenderInBrowser: true`.
More precisely, you should set `doNotRenderInBrowser: true` if your page's view is stateless.
E.g. a functional React component is always stateless and non-interactive.
So if your page's view is composed of functional React components only, then you should set `doNotRenderInBrowser: true`.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#basics">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>



## `renderHtmlAtBuildTime`

Every page is rendered to HTML.
(React and Vue.js components can be rendered to the DOM as well as to HTML.)

The page config option `renderHtmlAtBuildTime` allows you to control whether the page should be rendered statically at build-time or dynamically at request-time.

 - `renderHtmlAtBuildTime: false` (default value)
   <br/>
   The page is rendered to **HTML at request-time**.
   <br/>
   The page is (re-)rendered to HTML every time the user requests the page.
 - `renderHtmlAtBuildTime: true`
   <br/>
   The page is rendered to **HTML at build-time**.
   <br/>
   The page is rendered to HTML only once, when Reframe is building your app's pages.

By default a page is rendered to HTML at request-time.
But if a page is static
(a landing page, a blog post, a personal homepage, etc.) it would be wasteful to re-render its HTML on every page request.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#basics">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>








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
// /plugins/hapi/start.js

const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    // Run `$ reframe eject server-integration` to eject the integration plugin.
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
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>







## Custom Server Framework (Express, Koa, ...)

Check the [list of plugins](/docs/plugins.md) for a plugin that integrates the server framework you want to use with Reframe.
You can then get control over the server instance by runnning `$ reframe eject server`.

If there isn't a plugin for the server framework you want, then run
- `$ reframe eject server`
- `$ reframe eject server-integration`
to get full control over the integration of the current server framework and Reframe.
At that point you can get rid of the current server framework and replace it any other server framework.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>




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

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>









## Custom HTML &lt;head&gt;, &lt;meta&gt;, &lt;html&gt;, ...

Reframe uses [`@brillout/index-html`](https://github.com/brillout/index-html) to generate HTML.

You have full control over the "outer-part" HTML.
(`<meta>`, `<!DOCTYPE html`>, `<head>`, `<html>`, `<body>`, `<script>`, etc.)

There are two ways to change the outer-part HTML:
 - By creating a `index.html` file
 - Over the page config

1. Over the page config:

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
    doNotRenderInBrowser: true,
};
~~~

Note that if `awesome-lib.js` and `awesome-lib.css` are inside your project, you can't follow this
technique. Instead you will have to [customize the browser entry](#custom-default-browser-entry).

2. Over a `index.html` file saved in your app's root directory:

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
    doNotRenderInBrowser: true,
};
~~~

All `@brillout/index-html` options are available over the page config.

See [`@brillout/index-html`'s documentation](https://github.com/brillout/index-html) for the list of options.

Example:
 - [/examples/custom-head](/examples/custom-head)

If you want to use something else than `@brillout/index-html`, then you can eject the renderer,
see [Custom Renderer](#custom-renderer).

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>







## Custom Renderer

By default Reframe renders the `view` property of your page configs with React.

You can customize how your views are rendered.

Either use another plugin in the [list of renderer plugins](/docs/plugins.md#renderers) or eject the renderer with `$ reframe eject renderer`.

Ejecting the React renderer will copy the following code to your codebase.

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
// /plugins/react/renderToHtml.js

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

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>







## Custom Default Browser Entry

You can customize the browser entry code by running `$reframe eject browser`.

We encourage you to do so and you should if you want to:
  - Initialize user tracking such as Google Analytics
  - Initialize error tracking such as Sentry
  - Add a frontend library such as Bootstrap or Semantic UI
  - etc.

Running `$reframe eject browser` ejects the following code.

~~~js
// /plugins/browser/browserInit.js

import browserConfig from '@brillout/browser-config';

initBrowser();

async function initBrowser() {
    // Include pre-init code here

    // Plugins can add init functions
    // For example:
    //  - page hydration (i.e. rendering of the page to the DOM)
    //  - user tracking initialization
    for(const initFunction of Object.values(browserConfig.initFunctions)) {
        await initFunction();
    }

    // Include post-init code here
}
~~~

At this point you can [add a frontend library](#frontend-libraries).

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






## Custom Page Browser Entry

You can customize the browser entry code for a single page
without affecting the browser entry code of other pages.

You do this by setting the page config `browserInit`.
For example:

~~~js
// /examples/custom-browser/pages/custom-hydration.config.js

import React from 'react';
import TimeComponent from '../../basics/pages/time/TimeComponent';

export default {
    route: '/custom-hydration',
    browserInit: {
        initFile: './custom-hydration.js',
    },
    doNotRenderInBrowser: true,
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

~~~js
// /examples/custom-browser/pages/custom-hydration.js

import React from 'react';
import ReactDOM from 'react-dom';
import TimeComponent from '../../basics/pages/time/TimeComponent';
import './style.css';

ReactDOM.hydrate(<TimeComponent/>, document.getElementById('time-hook'));

console.log('custom hydration');
~~~

You can see the example in full and other examples at [/examples/custom-browser](/examples/custom-browser).

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






## Fully Custom Browser Entry

You can as well eject the code that orchestrates the hydration of the page by running `$ reframe eject browser-hydrate`.
If you want to customize the rendering process itself
you should run `$ reframe eject renderer` instead,
see [Custom Renderer](#custom-renderer).

The browser entry of each page is generated at build-time.
You can take control over the generation of browser entries by running `$ reframe eject build-browser-entries`.
We recommand to use the previously mentioned ejectables instead.
Use this ejectable as last resort.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






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


<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>





## Custom Router

Reframe can be used with any routing library.

Either use another plugin in the [list of router plugins](/docs/plugins.md#routers) or eject the router with `$ reframe eject router`.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
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
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






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

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






## Fully Custom Build

Run `$ reframe eject build` to eject the overall build code.

It will copy the following file to your codebase.

~~~js
// /plugins/build/runBuild.js

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
const serverEntryFile = projectConfig.transpileServerCode && projectConfig.serverStartFile;

const build = new Build({
    outputDir,
    getPageFiles,
    getPageBrowserEntries,
    getPageHtmls,
    getWebpackBrowserConfig,
    getWebpackNodejsConfig,
    log,
    doNotWatchBuildFiles,
    serverEntryFile,
});

watchDir(pagesDir, () => {build()});

module.exports = build;
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

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#custom">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>







## Static Deploy

If your app is html-static, you can deploy it to a static host.

Your app is html-static when all your page configs have `renderHtmlAtBuildTime: true`.
In that case,
all HTMLs are rendered at build-time,
your app consists of static assets only,
no Node.js server is required,
and your app can be statically served.

If you add the `@reframe/deploy-git` plugin you can then
run `$ reframe deploy` to automatically deploy your app.

The deploy command works with any static host that integrates with Git such as
[Netlify](https://www.netlify.com/) (recommanded) or
[GitHub Pages](https://pages.github.com/).

If you want to manually deploy then simply copy/serve the `dist/browser/` directory.
This directory contains all browser assets.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## Serverless Deploy

If your app is stateless then we recommand serverless deployment.

Serverless deployment solutions:
 - [Up](https://github.com/apex/up) - CLI tool to manage serverless deployement on AWS.
   <br/>
   The free tier is generous and will likely be enough for your first prototype.
   <br/>
   Step-by-step guide on how to deploy a Reframe app on Up: [github.com/AurelienLourot/reframe-on-up](https://github.com/AurelienLourot/reframe-on-up).
 - [Now](https://zeit.co/now) - Serverless host.
   <br/>
   The free tier doesn't support custom domains. (See [zeit.co/pricing](https://zeit.co/pricing).)


If you want to persist data, you may consider using a cloud database.
 - [List of cloud databases](/docs/cloud-databases.md)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## Vue

You can also use Reframe with Vue instead of React.

Check out the [`@reframe/vue`](/plugins/vue) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>

## React Router

You can use the React Router components by adding the [@reframe/react-router](/plugins/react-router) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>

## TypeScript

You can write your app with TypeScript by adding the [@reframe/typescript](/plugins/typescript) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>

## PostCSS

You can write your styles with PostCSS by adding the [@reframe/postcss](/plugins/postcss) plugin.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
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
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
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
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






## Frontend Libraries

As mentioned in [this section](#custom-default-browser-entry) you can add frontend libraries such as
Bootstrap or Semantic UI to your Reframe app. Such a library is usually made of `.css` and `.js`
assets and without Reframe you would link to them via `<link>` and `<script>`.

After having [ejected the browser entry code](#custom-default-browser-entry) import these assets
in your `browserInit.js`:

~~~js
import browserConfig from '@brillout/browser-config';

import './thirdparty/awesome-frontend-lib.js';
import './thirdparty/awesome-frontend-lib.css';

initBrowser();

async function initBrowser() {
    await browserConfig.hydratePage();
}
~~~

Note that you can also import `awesome-frontend-lib.css` in your pages and/or views instead.

For example:
 - [/examples/custom-browser-lib](/examples/custom-browser-lib)

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#use-cases">&#8679; TOP &#8679;</a></sub></b>
<br/>
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
