!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<h1>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Overview
</h1>

<br/>

<div><p align="center">
<a href="#intro">Intro</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#example">Example</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#quick-start">Quick Start</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#progressive-eject">Progressive Eject</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#universal">Universal</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#tech-specs">Tech Specs</a>
</p></div>

&nbsp;

### Intro

Reframe allows you to create web apps by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

~~~jsx
// A page config
const WelcomePage = {
  route: '/',
  view: () => <div>Welcome to Reframe</div>
};
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component,
 - a route, and
 - further optional page configurations

You can create an app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

Yet you can **customize** and (progressively) **eject everything**.

<br/>

### Example

In the following we create a web app
by defining a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

Reframe does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

<br/>

### Quick Start

!INLINE ./start.md --hide-source-path

To familiarize yourself with Reframe,
read the source code of `my-app/`,
check out the [Usage Manual](/docs/usage-manual.md),
and read this overview.

<br/>

### Progressive Eject

All of Reframe is ejectable and customizable.

For example, the command `reframe eject server` ejects [~30 LOC of server code](/plugins/server/startServer.js):
The server code is copied from Reframe's codebase to your codebase.
This gives you control over the server allowing you to add API endpoints, change the server config, use a process manager, etc.

There are several eject commands that you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

<br/>

### Universal

Reframe is universal, that is, you can create any type of web app:

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with interactive views.
   (A realtime graph, an interactive table, a To-Do list, etc.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup> 
   <br/>
   Apps without interactive views.
   (The browser loads no (or almost no) JavaScript and the DOM is static.)
 - **Serverless apps**
   <br/>
   Apps that don't need a Node.js server.
 - **Hybrid apps**
   <br/>
   Apps with interactive pages as well as non-interative pages.

Choosing the type of your app is only a matter of setting `htmlStatic: true` and/or `domStatic: true` to your page configs.

<br/>

### Tech Specs

###### Developer Experience

- **Mostly-non-interactive apps**
  <br/>
  You can write an app that has only few interactive views while the rest is non-interactive.
  <br/>
  Following the approach "Whenever possible, implement features with non-interative views".
  (Non-interactive views are considerably easier to implement.)
- **Learn once, write any app**
  <br/>
  Instead of learning a framework to create a static app and a second framework to create a dynamic app,
  you only learn Reframe to be able to implement any type of web app.
- **Serverless deploy**
  <br/>
  If your app is HTML-static
  (if all your page configs have `htmlStatic: true`)
  then it can be deployed to a static website host
  such as GitHub Pages or Netlify.
- **React Router**
  <br/>
  The syntax of the page config's `route` string is the same than in React Router v4.
  <br/>
  By adding the `@reframe/react-router` plugin
  you can use React Router's components `<Route>`, `<Switch>`, etc.
- **TypeScript**
  <br/>
  Add the `@reframe/typescript` plugin and write your app in TypeScript.
- **PostCSS**
  <br/>
  Add the `@reframe/postcss` plugin and write modern CSS.
- **Webpack**
  <br/>
  Reframe uses webpack to build the app's pages.
  Webpack
  is the state of the art to build browser assets.
- **Hapi**
  <br/>
  Reframe uses hapi to create the server.
  Hapi
  ([hapijs.com](https://hapijs.com/))
  is known for its robustness and scalability.

###### SEO

- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, pages are entirely rendered to HTML giving you full control over SEO.

###### Performance

- **Code-splitting**
  <br/>
  By default a page loads two scripts:
  One script that is shared and cached across all pages
  (that includes React, polyfills, etc.)
  and a second script that includes the React components of the page.
  That way, a page only loads what it needs.
- **Static DOM**
  <br/>
  When setting `domStatic: true` to a page config, the page is not hydrated.
  (In other words, the page is not rendered to the DOM but only rendered to HTML.)
  Not only is computational time saved by skipping rendering to the DOM but also load time is saved by skipping loading JavaScript code.
- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, a page is rendered to HTML on the server before being rendered to the DOM in the browser.
  That improves the user perceived load time.
- **Optimal HTTP caching**
  <br/>
  Every dynamic server response is cached with a ETag header.
  And every static server response is indefinitely cached.
- **Static Rendering**
  <br/>
  When setting `htmlStatic: true` to a page config, the page is rendered to HTML at build-time (instead of request-time).
  The page's HTML is rendered only once and is served statically.
  Decreasing load time.
