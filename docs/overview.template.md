!INLINE ./links.md --hide-source-path
!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Example](#example)
 - [Getting Started](#getting-started)
 - [Tech Specs](#tech-specs)

<br/>
<br/>

### Introduction

With Reframe you can create a web app simply by defining "page configs".
Your pages are automatically built and served.

~~~jsx
// A page config
const WelcomePage = {
  route: '/welcome',
  view: () => <div>Welcome to Reframe</div>,
  title: 'Welcome'
};
~~~

**No build configuration** and **no server configuration** is required.

Yet, since Reframe is progressively ejectable,
you can take control over everything.
Reframe **doesn't lock you in**.
You **quickly implement a prototype while staying fully flexible down the road**.

Reframe is a "Universal Framework":
You can create any type of app:
a modern **interactive frontend with React**,
a Node.js backend with **old-school non-interactive HTML pages**,
a **static site generated with Vue.js** components,
a **full-stack app** with modern frontend + Node.js server + **Database/ORM** (ORM integration is WIP).
Changing from one type of app to another is easy.
**Start write your prototype right away
without thinking about what type of app is right for you**.

When we say Reframe is rapid and flexible, we mean it.

More at [Concetps](/docs/concepts.md).

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>

### Example

We create an app
by defining a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

That's it: We created an entire web app simply by defining one page config. No build config, no server config.

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>

### Getting Started

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>




### Tech Specs

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
  WebAssembly is immensely promising and Reframe, being based on JavaScript, embraces the WebAssembly future.

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

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>


