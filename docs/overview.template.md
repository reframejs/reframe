!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

##### Contents

 - [What is Reframe](#what-is-reframe)
 - [Tech Specs](#tech-specs)
 - [Quick Start](#quick-start)


### What is Reframe

Reframe allows you to create web apps by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

~~~jsx
// A page config example
const WelcomePage = {
  route: '/', // Page's URL
  view: () => <div>Welcome to Reframe</div>, // Page's React component
  title: 'Welcome' // Page's <title>
};

export default WelcomePage;
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component (required),
 - a route (required), and
 - further optional page configurations

You can create a React web app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

Yet, **everything is customizable/ejectable**.

For example, the command `reframe eject server` ejects the server code:
It will copy the server code from Reframe's codebase to your codebase.
Giving you control over the server code allowing you to add API endpoints, change the server config, use a process manager, etc.

There are several eject commands to eject server code, build code, and browser code.

You can apply eject commands one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Rreframe doesn't lock you in: You can progressively and fully eject Reframe.

Let's create a web app by defining a page config `HelloPage`:

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

Reframe does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

Page configs have two options `htmlStatic: true` and `domStatic: true`
that allow you to create a wide variety of apps:

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with a dynamic DOM.
   <br/>
   You create React components to implement interactive views.
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps with a static DOM.
   <br/>
   You create React components to generate HTML.
   <br/>
   No (or almost no) JavaScript is loaded in the browser.
   <br/>
   (Besides being used to create interative views in the browser, React can as well be used as a powerful HTML template engine on the server.)
   <br/>
   Opt-in by setting `domStatic: true` to all your page configs.
 - **Serverless apps**
   <br/>
   Apps with static HTML.
   <br/>
   The HTML of all pages are rendered statically at build-time.
   <br/>
   The DOM can be static (static website) or dynamic (serverless interactive app).
   <br/>
   These apps don't need a Node.js server and can be deployed to a static host such as GitHub Pages or Netlify.
   <br/>
   Opt-in by setting `htmlStatic: true` to all your page configs.
 - **Hybrid apps**
   <br/>
   Apps with both static and dynamic HTML/DOM.
   <br/>
   Some pages are DOM-static, some DOM-dynamic, some HTML-static, and some HTML-dynamic.
   <br/>
   That way you can create couple of pages with interactive views while the rest of your app is non-interactive.
   Non-interactive views are considerably easier to implement and usually perform better.
   Hybrid apps allow the approach "Whenever possible, implement features with non-interative views".
   <br/>
   Opt-in by setting `htmlStatic: true` / `domStatic: true` to some of your page configs.

> With Reframe you can create dynamics apps, static apps, and hybrid apps.

### Tech Specs

- **Server-Side Rendering** (**SSR**) for SEO and improved speed
  <br/>
  By default all pages are rendered to HTML on the server
  (and hydrated in the browser).
  <br/>
  Giving you full control over SEO and improving the user perceived load time.
- **React Router**
  <br/>
  The page config's `route` string syntax is the same than in React Router v4.
  <br/>
  And by adding the [@reframe/react-router](/plugins/react-router) plugin
  you can use React Router's components `<Route>`, `<Switch>`, etc.
- **TypeScript**
  <br/>
  Add the [@reframe/typescript](/plugins/typescript) plugin and write your app in TypeScript.
- **PostCSS**
  <br/>
  Add the [@reframe/postcss](/plugins/postcss) plugin to write modern CSS.
- **Webpack**
  <br/>
  Reframe uses webpack to build the app's pages ([webpack.js.org](https://webpack.js.org/)).
  Webpack is the state of the art tool to build browser assets.
- **Hapi**
  <br/>
  Reframe uses hapi to create the server ([hapijs.com](https://hapijs.com/)).
  Hapi is known for its robustness and scalability.
- **Code-splitting** for improved speed
  <br/>
  Pages load two scripts:
  One script that is shared and cached across all pages
  (including React, polyfills, etc.)
  and a second script that includes the React components of the page.
  A KB-heavy page won't affect the KB-size of other pages.
- **Static DOM** for improved speed
  <br/>
  When setting `domStatic: true` to a page config, the page is not hydrated.
  (In other words, the page's view is not rendered to the DOM but only rendered to HTML.)
  Not only is computational time saved by skiping rendering to the DOM but also load time is saved by skipping loading heavy JavaScript code.
- **Optimal HTTP caching** for improved speed
  <br/>
  Every dynamic server response is cached with a ETag header,
  and every static server response is indefinitely cached.
  (Static assets are served under hashed URLs with the `Cache-Control` header set to `immutable` and `max-age`'s maximum value.)
- **Static Rendering** for improved speed
  <br/>
  When setting `htmlStatic: true` to a page config, the page is rendered to HTML at build-time (instead of request-time).
  The page's HTML is rendered only once and served statically for decreased load time.

### Quick Start

!INLINE ./start.md --hide-source-path

Read the source code of `my-app/` and check out the [Usage Manual](/docs/usage-manual.md) to familiarize yourself with Reframe's usage.
