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
// Page config `WelcomePage`

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
(But, if you need to, everything is configurable/customizable.)

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

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with a dynamic DOM where React is used to create interactive views.
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps with a static DOM where React is only used to render HTML.
   <br/>
   No (or almost no) JavaScript is loaded in the browser.
 - Apps with **Server-side rendering (SSR)**
   <br/>
   Apps where pages are rendered to HTML on the server (at request-time).
   <br/>
   SSR gives full control over SEO and improves load time.
   By default, apps created with Reframe have SSR.
 - **Serverless** interactive apps & static websites
   <br/>
   Apps where all pages are rendered to HTML at build-time.
   <br/>
   These apps don't need a Node.js server and can be deployed to a static host such as GitHub Pages or Netlify.
 - **Hybrid apps**
   <br/>
   Apps that have static pages as well as dynamic pages:
   Some pages have their HTML rendered at build-time while some at request-time, and some pages have a static DOM while some have a dynamic DOM.


Reframe generates a certain type of app depending on how you configure your pages.
For example, if you add `htmlStatic: true` to a page config, then that page's HTML is rendered at build-time instead of request-time.
Thus, creating a serverless app is simply a matter of setting `htmlStatic: true` to all page configs.


### Why Reframe

 - **Easy**
   <br/>
   Create web apps by simply defining page configs and React components.
   Reframe takes care of the rest.
 - **Universal**
   <br/>
   Reframe is the only framework that supports every type of static and dynamic app.
   Instead of learning one framework to create a static app and a second framework to create a dynamic app,
   you can learn Reframe to be able to create both static and dynamic apps.
   <br/>
   [Reframe Rationale - Universal](/docs/reframe-rationale.md#universal) shows what different types of apps there are and how Reframe supports them all.
 - **Escapable**
   <br/>
   Most of your code (~95%-99%) will be entirely independent of Reframe.
   This means that, if you decide to get rid of Reframe, you will have to rewrite only ~1%-5% of your code.
   <br/>
   And Reframe is designed so that you can progressively replace Reframe code with code of your own.
   That way, you can progressively get rid of Reframe to eventually take full control over your app.
   <br/>
   More at [Reframe Rationale - Escapable](/docs/reframe-rationale.md#escapable).

Also,
Reframe is based on **plugins** (React Router v4 plugin, TypeScript plugin, PostCSS plugin, ...),
is **fully customizable** (fully customize the webpack config, the building, the server, the browser code, the routing, the rendering, ...), and is **performant** (code splitting, optimal HTTP caching, static rendering, server-side rendering, ...).

The [Reframe Rationale](/docs/reframe-rationale.md) goes into detail.


### Quick Start

!INLINE ./start.md --hide-source-path

The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains further information, including:
 - How to add CSS and static assets.
 - How to navigate between pages.
 - How to configure pages to (asynchronously) load data.
 - How to configure pages to be DOM-static and/or HTML-static.
