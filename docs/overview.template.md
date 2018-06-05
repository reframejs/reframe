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
 - [Fully Flexible](#fully-flexible)
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

Yet, Reframe is **fully flexible**:
Thanks to its "Progressive Eject" feature and its simple design
**you can gain control and customize every part of Reframe**.

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

### Fully Flexible

Reframe is designed from the ground up to be as flexible as possible.

The goal is to give you the same flexibility as if you would implement your app with do-one-thing-do-it-well libraries.

At the core of Reframe's flexibility is the "Progressive Eject" feature
which allows you to progressively and fully gain control over your app.

Also, Reframe supports every type of apps.
(Modern apps with interactive views, goold ol' 1998 websites where the DOM is static, serverless apps, static websites, etc.)


###### Progressive Eject

All of Reframe can be progressively ejected.

For example, the CLI command `$ reframe eject server` ejects the server code:
[Around 30 lines of code](/plugins/server/startServer.js)
are copied from Reframe's codebase and added to your codebase.
Allowing you to modify the server code,
so you can add API endpoints, change server config, change server entirely, use a process manager, etc.

There are several eject commands that
you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

Once you fully eject Reframe, your app will not depend on Reframe anymore but will only depend on state-of-the-art and do-one-thing-and-do-it-well libraries.
At that point you have the same flexibility
as if you would have implemented your app on top of these do-one-thing-and-do-it-well libraries.

So you can quickly implement a prototype and
when your app turns into something big you can get rid of Reframe by progressively ejecting it.

> With Reframe you can quickly implement a prototype while staying fully flexible down the road.


###### Create any type of app

You can create

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with interactive views.
   (An interactive graph, an interactive table, a To-Do list, etc.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps without interactive views.
   (The DOM is static and the browser loads no JavaScript.)
 - **Mixed apps** :tm:
   <br/>
   Apps that mix both: Modern interactive pages <sup><sub>:sparkles:</sub></sup> as well as good ol' 1998 non-interative pages <sup><sub>:floppy_disk:</sub></sup>.

The cherry on the cake is that choosing the type of your app is only a matter of setting the page config options `htmlStatic` and `domStatic`.
Meaning that you can start writing your prototype and only at a later point decide the type of your app.

<br/>
<br/>

### Tech Specs

###### Developer Experience

- **Quick but flexible**
  <br/>
  Quickly implement apps while staying fully flexible.
  The sections above go into details.
- **Mixed Apps** :tm:
  <br/>
  Reframe introduces a new type of apps we call "Mixed Apps".
  A mixed app is an app that mixes interactive pages and non-interactive pages.

  For example a `/about` page that is static and non-interactive
  (browser doesn't load any JavaScript and the DOM is static)
  and a `/search` page that is dynamic and interactive
  (browser loads React components and the DOM is dynamic).
  Implement apps with mostly non-interactive pages and only few interactive pages.
  Following the non-interactive-by-default approach.
  (Implement features with non-interative views whenever possible.)


Both are important:
 - **Interactive** views are **difficult** to implement **but powerful**.
 - **Non-interactive** views are considerably **easier** to implement.

In general, we recommand to follow the **non-interactive-by-default approach**:
Whenever possible, implement features with non-interative views.

> Mixed apps allow you to follow the non-interactive-by-default approach.

Mixed apps are the future of web development and Reframe is the only framework supporting them.

- **Learn once, write any app**
  <br/>
  Instead of learning different frameworks to create different types of apps,
  learn Reframe once to be able to implement any type of web app.
  <br/>
  Reframe is the only framework that supports every type of web apps.
- **ORM** [WIP]
  <br/>
  To use an ORM you will have to manually add  manually add such as [TypeORM](https://github.com/typeorm/typeorm).
  But the Reframe devS are currently designing ways to create
- **Easy Deploy** [WIP]
  <br/>
  Serverless deploy
  If your app is HTML-static
  (if all your page configs have `htmlStatic: true`),
  no Node.js server is required and
  your app can be deployed to a static website host
  such as GitHub Pages or Netlify.


###### SEO

- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, pages are rendered to HTML giving you full control over SEO.
  <br/>
  Google successfully crawls DOM-dynamic pages only to a limited extend. In practice you need SSR for reliable SEO.

###### Integrations

- **React Router**
  <br/>
  Add the `@reframe/react-router` plugin
  to use the React Router components `<Route>`, `<Switch>`, etc.
- **React**
  <br/>
  By default, you define your page's views with React.
- **Vue.js**
  <br/>
  Add the `@reframe/vue` plugin and write your views with Vue instead of React.
- **TypeScript**
  <br/>
  Add the `@reframe/typescript` plugin and write your app in TypeScript.
- **PostCSS**
  <br/>
  Add the `@reframe/postcss` plugin and write modern CSS.
- **Webpack**
  <br/>
  By default, Reframe uses webpack to build the app's pages.
  Webpack
  is the state of the art tool to build browser assets.
- **Hapi**
  <br/>
  By default, Reframe uses hapi to create the server.
  Hapi
  ([hapijs.com](https://hapijs.com/))
  is known for its robustness and scalability.

###### Performance

- **Static DOM**
  <br/>
  When setting `domStatic: true` to a page config, the page is not hydrated.
  (In other words, the page is not loaded nor rendered in the browser, and is only rendered to HTML on the server.)
  These pages are very performant as (almost) no JavaScript is loaded/executed in the browser.
- **Code-splitting**
  <br/>
  By default a page loads two scripts:
  One script that is shared and cached across all pages
  (that includes common code such as React, polyfills, etc.)
  and a second script that includes the React components of the page.
  That way, a page only loads what it needs.
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
