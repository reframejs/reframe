<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.






-->
[<p align="center"><img src='https://github.com/brillout/reframe/raw/master/docs/logo/logo-with-title.svg?sanitize=true' width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/brillout/reframe)
<div><p align="center">
        Framework to create React web apps.
</p></div>
<div><p align="center">
    <b>Easy</b>
    -
    Create apps with page configs.
    &nbsp;&nbsp;&nbsp;
    <b>Universal</b>
    -
    Create all kinds of apps.
    &nbsp;&nbsp;&nbsp;
    <b>Customizable</b>
    -
    Everything is adaptable.
</p></div>
<br/>

[Overview](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Customization Manual](/docs/customization-manual.md)

<br/>

# Overview

##### Contents

 - [What is Reframe](#what-is-reframe)
 - [Why Reframe](#why-reframe)
   - [Ease of Use](#ease-of-use)
   - [Universality](#universality)
   - [Customization](#customization)
   - [Performance](#performance)
 - [Reframe Project Scope](#reframe-project-scope)
 - [Plugins](#plugins)
 - [Quick Start](#quick-start)



### What is Reframe

Reframe allows you to create web apps by simply defining so called "page configs".
Reframe then takes care of the rest: It automatically transpiles, bundles, serves, and routes your pages.

~~~js
// We create a landing page by defining a page config:
const LandingPage = {
    route: '/', // Page's URL
    view: () => <div>Welcome to Reframe</div>, // Page's root React component
    title: 'Welcome' // Page's <title>
};
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component (required),
 - a route (required), and
 - further (optional) page configurations (such as the page's &lt;title&gt;, meta tags, script tags, whether the page should be hydrated or not, whether the page's HTML should be rendered at build-time or at request-time, etc.).

You can build a React web app with **no build configuration and no server configuration**.

> All you need to create a web app is one React component and one page config per page.

And, if you need to, **everything is customizable**.
For example, you can customize the transpiling & bundling, the server, the browser entry, the Node.js entry, etc.

With Reframe you can create:

 - **Server-side rendered React apps**
   <br/>
   Apps where all pages are rendered to HTML on the server (at request-time or at build-time).

 - **Universal React apps**
   <br/>
   Apps where all pages are rendered to HTML on the server at request-time and hydrated in the browser.

 - **HTML-static React apps**
   <br/>
   Apps where all pages are rendered to HTML at build-time.
   These apps don't need a Node.js server and can be deployed to a static website hosting such as GitHub Pages or Netlify.

 - **DOM-static React apps**
   <br/>
   Apps where all pages' DOM are static and React is only used to render HTML.
   No (or almost no) JavaScript is loaded in the browser.

 - **Hybrid React apps**
   <br/>
   An app can be a mix: Some pages can be HTML-static, some pages HTML-dynamic, some others DOM-static, and some DOM-dynamic.

Reframe generates a certain type of app depending on how you configure your pages.
For example, if you add `htmlIsStatic: true` to a page config, then that page's HTML is rendered at build-time instead of request-time.
So creating an HTML-static React app is simply a matter of setting `htmlIsStatic: true` to all page configs.

Let's create a web app by defining a page config `HelloPage`:

~~~js
// ~/tmp/reframe-playground/pages/HelloPage.html.js

import React from 'react';

const HelloComponent = (
    props => {
        // Our route arguments are available at `props.route.args`
        const name = props.route.args.name;
        return (
            <div>Hello {name}</div>
        );
    }
);

const HelloPage = {
    route: '/hello/{name}', // Page's (parameterized) URL
    title: 'Hi there', // Page's <title>
    view: HelloComponent, // Page's root React component
};

export default HelloPage;
~~~

The `reframe` CLI does the rest:

<p align="center">
    <img src='https://github.com/brillout/reframe/raw/master/docs/screenshots/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

Reframe did the following:
 - Reframe searched for a `/pages` directory and found one at `~/tmp/reframe-playground/pages`.
 - Reframe read the `/pages` directory and found our page config at `~/tmp/reframe-playground/pages/HelloPage.html.js`.
 - Reframe used webpack to transpile `HelloPage.html.js`.
 - Reframe started a hapi server serving all static browser assets and serving our page by (re-)rendering its HTML on every request.

The "Quick Start" section below gives a step-by-step guide to create your first React web app with Reframe.

### Why Reframe

Reframe has been designed with a focus on:
 - [Ease of Use](#ease-of-use)
 - [Universality](#universality)
 - [Customization](#customization)
 - [Performance](#performance)

#### Ease of Use

Creating a React app is simply a matter of creating React components and page configs.
The "Quick Start" section below shows how easy it is.

#### Universality

A page config allows you to configure a page to be
 - *HTML-static*:
 The page is rendered to HTML at build-time.
 In other words, the page is rendered to HTML only once when Reframe is building the frontend.
 - *HTML-dynamic*:
 The page is rendered to HTML at request-time.
 In other words, the page is (re-)rendered to HTML every time the user requests the page.
 - *DOM-static*:
 The page is not hydrated.
 In other words, the page's DOM is not manipulated.
 - *DOM-dynamic*:
 The page is hydrated.

This fine-grain control over the "static-ness" of your app gives you the ability to implement a wide range of types of apps:
 - Static websites.
   <br/>
   In other words, apps where all pages are configured to be HTML-static.
   By configurating all pages as HTML-static, all pages are rendered to HTML at build-time and no Node.js server is needed.
   These apps can be deployed to static website hostings such as GitHub Pages or Netlify.
 - Sever-side rendered apps.
   <br/>
   In other words, apps where all pages are configured to be HTML-dynamic.
 - Universal apps.
   <br/>
   In other words, apps where all pages are configured to be HTML-dynamic & DOM-dynamic.
 - Hybrid apps.
   <br/>
   An app can have pages of different types:
   Some pages can be HTML-static, some pages HTML-dynamic, some others DOM-static, and some DOM-dynamic.
   You can for example configure your landing page to be HTML-static and DOM-static,
   your product page to be HTML-dynamic and DOM-static,
   and your product search page to be HTML-static and DOM-dynamic.

Reframe is the only React framework that supports all app types.

> Instead of learning different frameworks to create different types of apps,
> you learn Reframe once to be able to create all kinds of apps.

#### Customization

Reframe's basic usage is designed to be as easy as possible.
But Reframe also supports customization.
Many customizations are easy to achieve, and
Reframe allows "full customization": virtually everything is customizable.

Examples of customizations that are easy to achieve:
 - Custom server
   - Add server routes to add RESTful/GraphQL API endpoints, authentication endpoints, etc.
   - Custom hapi server config. (Reframe uses the hapi server framework by default.)
   - Use a process manager such as PM2.
   - etc.
 - Custom browser JavaScript
   - Add error logging, analytics, etc.
   - Full control of the hydration process.
   - etc.
 - Custom transpiling & bundling
   - Reframe can be used with almost any webpack config. (Reframe assumes pretty much nothing about the webpack config.)
   - TypeScript support
   - CSS preprocessors support, such as PostCSS, SASS, etc.
   - etc.
 - Custom routing library. (Reframe uses Crossroads.js by default.)
 - Custom view library such as Preact.
 - etc.

Also,
Reframe is designed with "full customization" in mind.
Reframe consists of three packages:
`@reframe/build` that transpiles and bundles assets,
`@reframe/server` that creates the server, and
`@reframe/browser` that hydrates the page in the browser.
Each of these packages can be replaced with code of your own.
This means that, if you replace all these three packages with your own code, you effectively get rid of Reframe.

Examples of customization achievable by replacing a Reframe package:
 - Custom server framework, such as Express, Koa, etc. (Reframe uses hapi by default)
 - Custom build tool, such as Rollup (Reframe uses webpack by default)
 - etc.

#### Performance

- Code splitting.
  <br/>
  Every page loads two scripts.
  A first script that is shared and cached accross all pages, which includes common code such as React and polyfills.
  And a second script that loads the React components of the page.
  This means that a page requiring KB-heavy libraries won't affect the KB-size of other pages.
- Optimal HTTP caching.
  <br/>
  Every dynamic server response is cached with a Etag header.
  Every static server response is indefinitely cached.
  (Static assets are served under hashed URLs with the `Cache-Control` header set to `immutable` and `max-age`'s maximum value.)
- DOM-static pages.
  <br/>
  A page can be configured to be rendered only on the server.
  These pages are faster to load as the page isn't hydrated and
  React is not loaded in the browser.
- Partial DOM-dynamic pages.
  <br/>
  A page can be configured so that only certain parts of the page are hydrated.
  This makes the hydration of the page quicker
  and less JavaScript is loaded in the browser. (Only the React components of the hydrated parts are loaded.)
- HTML-static pages.
  <br/>
  A page can be configured to be rendered to HTML at build-time instead of request-time.
  In other words, the page is rendered to HTML only once, namely when Reframe is building the frontend.
  The HTML is statically served and the load time is decreased.
- SSR.
  <br/>
  All pages are rendered to HTML before being hydrated, decreasing the (perceived) load time.



### Reframe Project Scope

Reframe takes care of:

 - **Building**
   <br/>
   Reframe transpiles and bundles the browser static assets. (Uses webpack.)
 - **Server**
   <br/>
   Reframe sets up a Node.js server serving the browser static assets and your pages' HTML. (Uses hapi.)
 - **Routing**
   <br/>
   Reframe routes URLs to your pages.

Reframe **doesn't** take care of:

 - View logic / state management
   <br/>
   It's up to you to manage the state of your interactive views (or use Redux / MobX).
 - Database
   <br/>
   It's up to you to create, populate, and query databases.
   (You can add API endpoints to the hapi server that Reframe creates.)


### Plugins

More to come...

 - [@reframe/postcss](/postcss) - Use Reframe with PostCSS

### Quick Start

Let's create our first React app.
We create our first page by defining a page config and a React component.

1. We create a `pages/` directory:

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~

2. We then create a new JavaScript file at `~/tmp/reframe-playground/pages/HelloWorldPage.html.js` that exports the following page config:

~~~js
import React from 'react';

const HelloWorldPage = {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
        </div>
    ),
};
export default HelloWorldPage;
~~~

3. We install Reframe's CLI and React:

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
npm install react
~~~

4. And finally, we run the CLI:

~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
reframe
~~~

which prints

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Page directory found at ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

That's it: We have created our first React web app by simply creating one React Component and one page config.

The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains further information, including:
 - How to configure pages that need to (asynchronously) load data.
 - How to add CSS and static assets.
 - How to link pages.
 - How to configure pages to be DOM-dynamic or DOM-static, and HTML-static or HTML-dynamic.

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.






-->
