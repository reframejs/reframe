!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

##### Contents

 - [What is Reframe](#what-is-reframe)
 - [Why Reframe](#why-reframe)
 - [Quick Start](#quick-start)


### What is Reframe

Reframe allows you to create web apps by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

~~~jsx
// We create a page by defining a page config:

const WelcomePage = {
  // Page's URL
  route: '/',

  // Page's React component
  view: () => <div>Welcome to Reframe</div>,

  // Page's <title>
  title: 'Welcome'
};

export default WelcomePage;
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component (required),
 - a route (required), and
 - further (optional) page configurations (page's &lt;title&gt;, meta tags, whether the page's HTML should be rendered at build-time or at request-time, whether the page should be hydrated or not, etc.).

You can create a React web app with **no build configuration** and **no server configuration**.
(But, if you need to, everything is customizable.)

> All you need to create a web app is one React component and one page config per page.

Let's create a web app by defining a page config `HelloPage`:

~~~jsx
// ~/tmp/reframe-playground/pages/HelloPage.html.js

!INLINE ../examples/basics/pages/HelloPage.js --hide-source-path
~~~

The `reframe` CLI does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

Reframe did the following:
 - Reframe searched for a `pages/` directory and found one at `~/tmp/reframe-playground/pages`.
 - Reframe read the `pages/` directory and found our page config at `~/tmp/reframe-playground/pages/HelloPage.html.js`.
 - Reframe used webpack to transpile `HelloPage.html.js`.
 - Reframe started a Node.js/hapi server that serves all static assets and renders our page's HTML.

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
   Apps with mixed page types:
   Some pages are rendered to HTML at build-time and others at request-time, and some pages have a static DOM while others have a dynamic DOM.

Reframe generates a certain type of app depending on how you configure your pages.
For example, if you add `htmlStatic: true` to a page config, then that page's HTML is rendered at build-time instead of request-time.
So, creating a static app is simply a matter of setting `htmlStatic: true` to all page configs.

The "Quick Start" section below gives a step-by-step guide to create a React app with Reframe.


### Why Reframe

 - **Easy**
   <br/>
   Create web apps by simply defining page configs and React components.
 - **Universal**
   <br/>
   Reframe is the only framework that supports every type of app.
   Instead of learning different frameworks to create different types of apps,
   learn Reframe once to be able to create all types of apps.
   The [Reframe Rationale](/docs/reframe-rationale.md) explains the different types of web apps there is,
   and shows how Reframe supports them all.
 - **Escapable**
   <br/>
   Most of your code (~95%-99%) will be entirely independent of Reframe.
   This means that, if you decide to get rid of Reframe, you will have to rewrite only ~1%-5% of your code.
   The [Reframe Rationale](/docs/reframe-rationale.md) explains why.

Also,
Reframe is based on **plugins** (React Router v4 plugin, TypeScript plugin, PostCSS plugin, ...),
is **highly customizable** (fully customize the webpack config, the server, the browser entry, the Node.js entry, the routing, ...), and is **performant** (code splitting, optimal HTTP caching, HTML pre-rendering, ...).

The [Reframe Rationale](/docs/reframe-rationale.md) goes into detail.


### Quick Start

!INLINE ./start.md --hide-source-path

The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains further information, including:
 - How to add CSS and static assets.
 - How to navigate between pages.
 - How to configure pages to (asynchronously) load data.
 - How to configure pages to be DOM-static and/or HTML-static.
