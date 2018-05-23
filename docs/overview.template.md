!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Example](#example)
 - [Quick Start](#quick-start)
 - [Progressive Eject](#progressive-eject)
 - [Universal](#universal)
 - [Tech Specs](#tech-specs)

<br/>
<br/>

### Introduction

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
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

<br/>
<br/>

### Quick Start

!INLINE ./start.md --hide-source-path

To familiarize yourself with Reframe,
read the source code of `my-app/`,
check out the [Usage Manual](/docs/usage-manual.md),
and read this overview.

<br/>
<br/>

### Progressive Eject

All of Reframe is ejectable and customizable.

For example, the CLI command `$ reframe eject server` ejects the server code:
[Around 30 lines of code](/plugins/server/startServer.js)
are copied from Reframe's codebase and added to your codebase.
Allowing you to modify the server code,
so you can add API endpoints, change server config, change server entirely, use a process manager, etc.

There are several eject commands that
you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

  as if you would implement your app from scratch on top of do-one-thing-and-do-it-well libraries.

Giving as if you would write your app on top of do-one-thing-and-do-it-well libraries
Allowing you 
This allows you to
> Quickly implement a prototype while keeping the same flexibility as if you write your app from scratch.

> Quickly implement a prototype while keeping full flexbility

You can think of Reframe as a tiny wrapper on top of rock-solid do-one-thing-and-do-it-well libraries that allows you to quickly implement a prototype and as your app matures you progressively eject Reframe to eventually get rid of Reframe entirely.

<br/>
<br/>

### Universal

Reframe is universal, that is, you can create any type of web app:

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with interactive views.
   (An interactive graph, an interactive table, a To-Do list, etc.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps without interactive views.
   (The DOM is static and the browser loads no JavaScript.)
 - **Hybrid apps** :tm:
   <br/>
   Apps that have both: Modern interactive pages :sparkles: as well as good ol' 1998 non-interative pages :floppy_disk:.

Choosing the type of your app is only a matter of setting the page config options `htmlStatic` and `domStatic`.
(Explanation at [Usage Manual - `domStatic` & `htmlStatic`](/docs/usage-manual.md#domstatic--htmlstatic).)

> Reframe is the only framework that supports every type of web apps.

Instead of learning different frameworks for different types of apps,
learn Reframe to be able to write any type of web app.

> Learn once, write any app.

###### Hybrid apps :tm:

In general:
 - **Interactive** views are **difficult** to implement **but powerful**.
 - **Non-interactive** views are considerably **easier** to implement.

This leads us to:

> The **non-interactive-by-default approach**: Whenever possible, implement features with non-interative views.

With Reframe you can write a hybrid app that has only few interactive views while the rest is non-interactive.

> Hybrid apps allow you to follow the non-interactive-by-default approach.

Reframe is the only framework that supports hybrid apps and they are the future of web development.

<br/>
<br/>

### Tech Specs

###### Developer Experience

- **Quick but flexible**
  <br/>
  Create an app simply by defining React components and page configs.
  <br/>
  And thanks to progressive eject, you have full flexibility.
  More at [Progressive Eject](#progressive-eject).
- **Hybrid apps** :tm:
  <br/>
  Implement apps with easy-to-implement non-interactive pages and only some difficult-to-implement-but-powerful interactive pages.
  <br/>
  More at [Universal](#universal).
- **Learn once, write any app**
  <br/>
  Instead of learning different frameworks to create different types of apps,
  learn Reframe once to be able to implement any type of web app.
  <br/>
  More at [Universal](#universal).
- **Static deploy**
  <br/>
  If your app is HTML-static
  (if all your page configs have `htmlStatic: true`),
  no Node.js server is required and
  your app can be deployed to a static website host
  such as GitHub Pages or Netlify.
- **Vue.js**
  <br/>
  Add the `@reframe/vue` plugin and write your views with Vue instead of React.
- **React Router**
  <br/>
  Add the `@reframe/react-router` plugin
  to use the React Router components `<Route>`, `<Switch>`, etc.
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
  is the state of the art tool to build browser assets.
- **Hapi**
  <br/>
  Reframe uses hapi to create the server.
  Hapi
  ([hapijs.com](https://hapijs.com/))
  is known for its robustness and scalability.

###### SEO

- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, pages are rendered to HTML giving you full control over SEO.

###### Performance

- **Code-splitting**
  <br/>
  By default a page loads two scripts:
  One script that is shared and cached across all pages
  (that includes common code such as React, polyfills, etc.)
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
  Improving the user-perceived load time.
- **Optimal HTTP caching**
  <br/>
  Every dynamic server response is cached with a ETag header.
  And every static server response is indefinitely cached.
- **Static Rendering**
  <br/>
  When setting `htmlStatic: true` to a page config, the page is rendered to HTML at build-time (instead of request-time).
  The page's HTML is rendered only once and is served statically.
  Decreasing load time.

<br/>
<br/>


> Reframe is the only framework that supports all types of web apps

Instead of learning different frameworks for different types of apps,
you learn Reframe once to be able to write any type of web app



Quickly implement a prototype while progressively ejecting Reframe as your app matures
Quickly implement a prototype and, as your app matures, progressively eject Reframe.

Quickly implement a prototype. later as your app matures, progressively eject Reframe.

Quickly implement a prototype. Progressively eject Reframe later as your app matures,
