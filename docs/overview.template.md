!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Example](#example--top)
 - [Quick Start](#quick-start--top)
 - [Fully Flexible](#fully-flexible--top)
 - [Tech Specs](#tech-specs--top)

<br/>
<br/>

### Introduction

With Reframe you can create a web app simply by defining "page configs".
Your pages are automatically built and served.

~~~jsx
// A page config
const WelcomePage = {
  route: '/',
  view: () => <div>Welcome to Reframe</div>
};
~~~

**No build configuration** and **no server configuration**.

Yet, thanks to its "Progressive Eject" feature and its simple architecture,
**you can easily customize and gain control over everything**.

Reframe is a "Universal Framework":
You can create any type of apps such as **modern interactive apps**
as well as **old-school non-interactive apps**.

<br/>
<br/>

### Example !INLINE ./top-link.md #overview

We create a web app
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

### Quick Start !INLINE ./top-link.md #overview

!INLINE ./start.md --hide-source-path

To familiarize yourself with Reframe,
read the source code in `my-app/`,
read this overview, and
check out the [Usage Manual](/docs/usage-manual.md).

<br/>
<br/>

### Fully Flexible !INLINE ./top-link.md #overview

Reframe is designed from the ground up to be flexible.
The goal is to give you the same flexibility as if you would use do-one-thing-do-it-well libraries.

At the core of Reframe's flexibility is the "Progressive Eject" feature
which allows you to progressively and fully gain control over your app.
Also, Reframe is a universal framework: It supports every type of apps.

 - [Progressive Eject](#progressive-eject)
 - [Universal Framework](#universal-framework)

#### Progressive Eject

All of Reframe can be progressively ejected.

For example, the CLI command `$ reframe eject server` ejects the server code:
[Around 30 lines of code](/plugins/hapi/start.js)
are copied from Reframe's codebase and added to your codebase.
Allowing you to modify the server code.
You can then
add API endpoints,
change the server config,
change the whole server implementation,
etc.

There are several eject commands that
you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

Once you fully eject Reframe, your app will not depend on Reframe anymore.
Instead it will depend on state-of-the-art and do-one-thing-do-it-well libraries only.
At that point you have the same flexibility
as if you would have implemented your app on top of these do-one-thing-do-it-well libraries.

> Quickly implement a prototype while staying fully flexible down the road.


#### Universal Framework

Reframe is universal, that is, you can create any type of web app:

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with interactive views.
   (An interactive graph, a like button, a To-Do list, etc.) (The browser loads the page's view and renders it to the DOM &mdash; the DOM is dynamic.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps without interactive views.
   (The browser doesn't load any JavaScript. The DOM is static.)
 - **Mixed apps** :tm:
   <br/>
   Apps that mix both: Modern interactive pages <sup><sub>:sparkles:</sub></sup> as well as good ol' 1998 non-interative pages <sup><sub>:floppy_disk:</sub></sup>.

The cherry on the cake is that choosing the type of your app is simply a matter of setting the page config options `htmlStatic` and `domStatic`.
This means that you can start writing your prototype and decide only at a later point what type of app is right for you.

> Reframe is the only framework that supports every type of web app.

<br/>
<br/>

### Tech Specs !INLINE ./top-link.md #overview

 - [Developer Experience](#developer-experience)
 - [SEO](#seo)
 - [Integrations](#integrations)
 - [Performance](#performance)

###### Developer Experience

- **Quick but flexible**
  <br/>
  Quickly implement apps while staying fully flexible.
  See the "Fully Flexible" section.
  <br/>
- **Mixed Apps** :tm:
  <br/>
  Reframe introduces a new type of app we call "mixed apps".
  A *mixed app* is an app that has interactive pages as well as non-interactive pages.
  For example a `/about` page that is static and non-interactive
  (browser doesn't load any JavaScript and the DOM is static)
  and a `/search` page that is dynamic and interactive
  (browser loads React components and the DOM is dynamic).
  <br/>
  Both are important:
  Interactive views are difficult to implement but powerful while
  non-interactive views are considerably easier to implement.
  <br/>
  Mixed apps allow you to follow the non-interactive-by-default approach:
  Whenever possible, implement features with non-interative views.
  <br/>
  Mixed apps are the future and Reframe is the only framework supporting them.
- **Learn once, write any app**
  <br/>
  Instead of learning different frameworks to create different types of apps,
  learn Reframe once to be able to implement any type of web app.
  <br/>
  Reframe is the only framework that supports every type of web app.
  <br/>
- **ORM** [WIP]
  <br/>
  To use an ORM (such as [TypeORM](https://github.com/typeorm/typeorm)) you will have to create API endpoints yourself.
  But the Reframe devS are currently designing ways so that you can access your data from the frontend without having to create API endpoints yourself.
  <br/>
  Work-in-progress. (Follow [twitter.com/reframejs](https://twitter.com/reframejs) to get updates.)
  <br/>
- **User Mangement** [WIP]
  <br/>
  Once Reframe integrates with ORMs, Reframe will be able to take care of user management.
  <br/>
  Work-in-progress. (Follow [twitter.com/reframejs](https://twitter.com/reframejs) to get updates.)
- **Easy Deploy** [WIP]
  <br/>
  If your app is static you can easily deploy it by using `$ reframe deploy-static`.
  (Supports all static hosts that have git integration such as GitHub Pages, Netlify, Firebase, etc.)
  <br/>
  Also, Reframe is exploring ways to deploy
  to serverless services such as AWS Lambda and
  serverless databases such as AWS DynamoDB or Google Cloud Datastore.
  <br/>
  This will eventually mean that the entire deployment and scaling is done for you.
  <br/>
  Work-in-progress. (Follow [twitter.com/reframejs](https://twitter.com/reframejs) to get updates.)


###### SEO

- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, all pages are rendered to HTML.
  This gives you full control over SEO.
  <br/>
  (Google successfully crawls DOM-dynamic pages only to a limited extend.
  In practice you need SSR for reliable SEO.)

###### Integrations

- **React**
  <br/>
  By default, you define your pages' views with React.
- **React Router**
  <br/>
  You can use the React Router components (`<Route>`, `<Switch>`, etc.) by adding the `@reframe/react-router` plugin.
- **Vue.js**
  <br/>
  You can write your views with Vue instead of React by adding the `@reframe/vue` plugin.
- **TypeScript**
  <br/>
  Write your app in TypeScript by adding the `@reframe/typescript` plugin.
- **PostCSS**
  <br/>
  Add the `@reframe/postcss` plugin and write modern CSS with PostCSS.
- **Hapi**
  <br/>
  By default, Reframe uses hapi to create the server.
  Hapi
  ([hapijs.com](https://hapijs.com/))
  is known for its robustness and scalability.
- **Express**
  <br/>
  Add the `@reframe/express` plugin and write your backend with Express instead of hapi.
- **Webpack**
  <br/>
  By default, Reframe uses webpack to build static assets.
  Webpack
  is the state-of-the-art tool to do so.
- **WebAssembly**
  <br/>
  WebAssembly is immensely promising and Reframe, being based on JavaScript and Node.js, embraces the WebAssembly future.

###### Performance

- **Static DOM**
  <br/>
  When setting `domStatic: true` to a page config, the page is not hydrated.
  (In other words, the page is not loaded nor rendered in the browser. It is only rendered to HTML on the server.)
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
