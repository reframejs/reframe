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

Yet Reframe is progressively ejectable and
you can take control over everything.
**No lock in**.
**Quickly implement a prototype while staying fully flexible down the road**.

Reframe is a "Universal Framework",
that is you can create any type of app:
a **modern interactive frontend with React**,
a Node.js backend with **old-school non-interactive HTML pages**,
a **static site generated with Vue.js**,
a **full-stack app** with modern frontend + Node.js server + **Database/ORM** (ORM integration is WIP).
Changing app type is easy so you can
**start write your prototype right away, and
only later decide the type of your app**.

More at [Concetps](/docs/concepts.md).

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>

### Example

We define a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

And that's it.
We created an entire web app simply by defining one page config.
No build config, no server config.

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

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

- **Rapid & Flexible** -
  Quickly implement apps while staying fully flexible.
- **Non-interactive-by-default Approach** -
  Increase dev speed by choosing non-interactive over interactive. More at [Concetps](/docs/concepts.md).
- **Learn once, write any app** -
  Learn Reframe once to be able to implement any type of web app.
- **Easy Deploy** -
  Automatic deploy of static apps. WIP: Automatic deploy of serverless apps (incl. serverless database).
- **ORM & User Management** -
  Work-in-progress. Stay tuned at [twitter.com/reframejs](https://twitter.com/reframejs).


###### SEO

- **Server-Side Rendering** -
  Pages are fully rendered to HTML giving you full control over SEO.

###### Integrations

- **React** -
  Write views with React.
- **React Router** -
  Add the @reframe/react-router plugin and use the React Router components.
- **Vue.js** -
  Add the @reframe/vue plugin and write your views with Vue.
- **TypeScript** -
  Add the @reframe/typescript plugin and write your app with TypeScript.
- **PostCSS** -
  Add the @reframe/postcss plugin and write modern CSS with PostCSS.
- **Hapi** -
  The server is created with the robust and scalable server framework Hapi.
- **Express** -
  Add the @reframe/express plugin and write your backend with Express.
- **Webpack** -
  The state-of-the-art tool webpack is used to build static assets.
- **WebAssembly** -
  Reframe is based on JavaScript and embraces the WebAssembly future.

###### Performance

- **Static Browser** -
  Pages can be configured to not be loaded nor rendered in the browser.
- **Code-splitting** -
  The browser loads only one page at a time.
- **Server-Side Rendering** -
  Pages are fully rendered to HTML.
- **Optimal HTTP caching** -
  Static responses are indefinitely cached and
  dynamic responses are cached with ETag.
- **Static Rendering** -
  Pages can be configured to be rendered to HTML at build-time (instead of request-time).

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>


