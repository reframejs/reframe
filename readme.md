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
<div><p align="right"><sup>
    <img src="https://github.com/brillout/reframe/raw/master/docs/images/online-icon.svg?sanitize=true" width="13" height="20"> Chat with Reframe author on <a href="https://discord.gg/kqXf65G">discord.gg/kqXf65G</a>
</sup></p></div>

[<p align="center"><img src="https://github.com/brillout/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/brillout/reframe)

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
    <b>No lock-in</b>
    -
    Progressive escape.
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
   - [No Lock-in](#no-lock-in)
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

You can build a React web app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

And, if you need to, **everything is customizable**.
For example, you can customize the transpiling & bundling, the server, the browser entry, the Node.js entry, etc.

With Reframe you can create:

 - **Server-side rendered apps**
   <br/>
   Apps where pages are rendered to HTML on the server.
 - **Static apps**
   <br/>
   Apps where pages are rendered to HTML at build-time.
   <br/>
   These apps don't need a Node.js server and can be deployed to a static website hosting such as GitHub Pages or Netlify.
 - **DOM-static apps**
   <br/>
   Apps where the DOM is static and React is only used to render HTML.
   <br/>
   No (or almost no) JavaScript is loaded in the browser.
 - **Hybrid apps**
   <br/>
   Apps where pages are mixed:
   Some pages are rendered to HTML at build-time while others at request-time, and some pages have a static DOM while others have a dynamic DOM.

Reframe generates a certain type of app depending on how you configure your pages.
For example, if you add `htmlIsStatic: true` to a page config, then that page's HTML is rendered at build-time instead of request-time.
So, creating a static app is simply a matter of setting `htmlIsStatic: true` to all page configs.

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
    route: '/hello/:name', // Page's (parameterized) URL
    title: 'Hi there', // Page's <title>
    view: HelloComponent, // Page's root React component
};

export default HelloPage;
~~~

The `reframe` CLI does the rest:

<p align="center">
    <img src='https://github.com/brillout/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

Reframe did the following:
 - Reframe searched for a `/pages` directory and found one at `~/tmp/reframe-playground/pages`.
 - Reframe read the `/pages` directory and found our page config at `~/tmp/reframe-playground/pages/HelloPage.html.js`.
 - Reframe used webpack to transpile `HelloPage.html.js`.
 - Reframe started a Node.js/hapi server serving all static browser assets and serving our page by (re-)rendering its HTML on every request.

The "Quick Start" section below gives a step-by-step guide to create your first React web app with Reframe.

### Why Reframe

Reframe has been designed with a focus on:
 - [Ease of Use](#ease-of-use)
 - [Universality](#universality)
 - [Customization](#customization)
 - [No Lock-in](#no-lock-in)
 - [Performance](#performance)

#### Ease of Use

Creating a React app is simply a matter of creating React components and page configs.
The "Quick Start" section below shows how easy it is.

#### Universality

A fundamental aspect of the page config is that it allows you to configure a page to be what we call "HTML-static" or "HTML-dynamic", and "DOM-static" or "DOM-dynamic":
 - *HTML-static*
   <br/>
   The page is rendered to HTML at build-time.
   <br/>
   (In other words, the page is rendered to HTML only once, when Reframe is building the frontend.)
 - *HTML-dynamic*
   <br/>
   The page is rendered to HTML at request-time.
   <br/>
   (In other words, the page is (re-)rendered to HTML every time the user requests the page.)
 - *DOM-static*
   <br/>
   The page is not hydrated.
   <br/>
   (In other words, the DOM doesn't have any React component attached to it and the DOM will not change.)
 - *DOM-dynamic*
   <br/>
   The page is hydrated.
   <br/>
   (In other words, React components are attached to the DOM and the page's DOM will eventually be updated by React.)

This fine-grain control over the "static-ness" of your pages gives you the ability to implement all app types.

For example, you can create:
 - Server-side rendered apps.
   <br/>
   (In other words HTML-dynamic apps: All pages are configured to be HTML-dynamic.)
 - Static websites.
   <br/>
   (In other words HTML-static apps: All pages are configured to be HTML-static.)
   <br/>
   Since all pages are rendered to HTML at build-time, no Node.js server is needed.
   These apps can be deployed to static website hostings such as GitHub Pages or Netlify.
 - DOM-static apps
   <br/>
   (In other words, apps where all pages are configured to be DOM-static.)
   <br/>
   Since the page is not hydrated, React is not loaded in the browser.
   No (or almost no) JavaScript is loaded in the browser.
 - Hybrid apps.
   <br/>
   An app can have pages of different kinds:
   Some pages can be configured to be HTML-static, some pages to be HTML-dynamic, some others to be DOM-static, and some to be DOM-dynamic.
   You can for example configure your landing page to be HTML-static and DOM-static,
   your product page to be HTML-dynamic and DOM-static,
   and your product search page to be HTML-static and DOM-dynamic.

Reframe is the only React framework that supports all app types.

> Instead of learning different frameworks to create different types of apps,
> you learn Reframe once to be able to create all types of apps.

#### Customization

Reframe is desgined with easy customization in mind.
For example, the following are easy to achieve:
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
 - Custom routing library. (Reframe uses `path-to-regexp` by default.)
 - Custom view library such as Preact.

#### No Lock-in

Strictly speaking, Reframe does have a lock-in: You write page configs that only Reframe understands.
And, not only Reframe, but every framework can be escaped from.

But the escape cost greatly varies:
 1. How much code can be re-used after the escape?
 2. How progressively can the framework be escaped?

These two points measure the lock-in degree of a framework.

For example, if no code can be re-used after escaping a framework, then that framework is very bad from a lock-in perspective.

Let's measure Reframe's lock-in degree.

###### Code re-use after escape

Reframe is built on top of widely-used and high-quality "Do One Thing and Do It Well" (DOTADIW) libraries such as webpack, hapi, React, React Router, etc.
This means that you can re-use lot's of code after escaping Reframe:
For example, if you escape from Reframe but still plan on using a hapi server, then your whole server code can be re-used.

In general, all code that your write against one of these DOTADIW library is code that you can use independently of Reframe.

> Most of your code can be re-used after escaping Reframe.

When worrying about framework lock-in, one of the main question to ask yourself is "am I writing code against an interface introduced by the framework or against an interface of a DOTADIW library?".
If the latter is the case, then you are not locking yourself into the framework.

###### Progressive escape

Reframe consists of three packages:
 - `@reframe/build` that transpiles code and bundles browser assets.
 - `@reframe/server` that creates and manages the server.
 - `@reframe/browser` that handles the browser side and hydrates the page.

Each of these packages can be replaced with code of your own.

For example,
you can replace Reframe's server `@reframe/server` with your own server implementation.
At that point,
you have full control over the server,
while still using the rest of Reframe.

Similarly,
if you replace Reframe's build `@reframe/build` with your own build implementation,
then you have full control over the build step,
while still using the rest of Reframe.

> Reframe can be *progressively* escaped.

And if you replace all these three packages with your own code, you effectively entirely escape from Reframe.

The Customization Manual explains how to escape from these three packages and includes examples such as:
 - Entirely custom build using Rollup (instead of webpack and by getting rid of `@reframe/build`).
 - Entirely custom server using Express (instead of hapi and by getting rid of `@reframe/server`).
 - Entirely custom browser-side code (by getting rid of `@reframe/browser`).

###### Meteor, the counter example

On the other side of spectrum of the lock-in degree, there is Meteor.
It consists of many parts that you can only use if you use the entire Meteor stack.
For example, you can use its build system only if you use Meteor in its entirely.
This means that, if you want to escape Meteor, you will have to re-write all code related to these Meteor-specific parts.

And it has not been designed with loosely coupled parts;
With Meteor, it's mostly either all-in or all-out.
In other words, you can't escape in a progressive manner.



#### Performance

- **Code splitting**
  <br/>
  Every page loads two scripts:
  A script that is shared and cached accross all pages
  (which includes common code such as React and polyfills)
  and a another script that includes the React components of the page.
  This means that a KB-heavy page won't affect the KB-size of the other pages.
- **Optimal HTTP caching**
  <br/>
  Every dynamic server response is cached with a Etag header,
  and every static server response is indefinitely cached.
  (Static assets are served under hashed URLs with the `Cache-Control` header set to `immutable` and `max-age`'s maximum value.)
- **DOM-static pages**
  <br/>
  A page can be configured to be rendered only on the server.
  These pages are faster to load as the page isn't hydrated and
  React is not loaded in the browser.
- **Partial DOM-dynamic pages**
  <br/>
  A page can be configured so that only certain parts of the page are hydrated.
  This makes the hydration of the page quicker
  and less JavaScript is loaded in the browser.
  (Only the React components of the hydrated parts are loaded.)
- **HTML-static pages**
  <br/>
  A page can be configured to be rendered to HTML at build-time instead of request-time.
  In other words, the page is rendered to HTML only once, when Reframe is building the frontend.
  The HTML is statically served and the load time is decreased.
- **SSR**
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

###### Languages
 - [@reframe/postcss](/postcss) - Use Reframe with PostCSS

###### Routing
 - [@reframe/react-router](/react-router) - Use Reframe with React Router v4
 - [@reframe/crossroads](/crossroads) - Use Reframe with [Crossroads.js](https://github.com/millermedeiros/crossroads.js)
 - [@reframe/path-to-regexp](/path-to-regexp) - Use Reframe with `path-to-regexp`

###### Kits
 - [@reframe/default-kit](/default-kit) - Reframe's default kit

###### View renderers
 - [@reframe/react](/react) - Use Reframe with React

### Quick Start

Let's create a React app with Reframe.

1. We create a `pages/` directory:

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~

2. Then, we create a new JavaScript file at `~/tmp/reframe-playground/pages/HelloWorldPage.html.js` that exports the following page config:

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
 - How to add CSS and static assets.
 - How to link pages.
 - How to configure pages that need to (asynchronously) load data.
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
