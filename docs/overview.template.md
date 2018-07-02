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

With Reframe you create web apps by defining "page configs".
Your pages are automatically built and served.

~~~jsx
// A page config
const WelcomePage = {
  route: '/welcome',
  view: () => <div>Welcome to Reframe</div>,
  title: 'Welcome'
};
~~~

**No build configuration** and **no server configuration** required.

<br/>

Reframe is progressively ejectable.

This means:
 - You can take control over and customize everything.
 - **No lock-in**.
 - You can quickly implement a prototype while staying fully flexible down the road.

More at [Concepts - Progressive Eject](/docs/concepts.md#progressive-eject).

<br/>

Reframe is a "Universal Framework",
that is you can create any type of app.

Such as
 - a **modern interactive frontend with React**,
 - a Node.js backend with **old-school non-interactive HTML pages**,
 - a static site generated with Vue.js,
 - a full-stack app with modern frontend + **Node.js server** + **Database/ORM** (ORM integration is WIP).

Changing the type of your app is easy.
So you can
start write your prototype and
**decide later the type of your app**.

More at [Concepts - Universal Framework](/docs/concepts.md#universal-framework).

!INLINE ./top-link.md #overview --hide-source-path

<br/>

<br/>

### Example

We define a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

That's it.
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

###### Developer Experience

- **Rapid & Flexible** -
  Quickly implement apps while staying fully flexible.
- **Non-interactive first** -
  Increase dev speed by prefering non-interactive over interactive. (More at [Concepts](/docs/concepts.md#non-interactive-first-approach).)
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
  Add the @reframe/react-router plugin and use React Router components.
- **Vue.js** -
  Add the @reframe/vue plugin and write views with Vue.
- **TypeScript** -
  Add the @reframe/typescript plugin and write your app with TypeScript.
- **PostCSS** -
  Add the @reframe/postcss plugin and write modern CSS with PostCSS.
- **Netlify** -
  Automatic deploy of static apps with Netlify.
- **GitHub Pages** -
  Automatic deploy of static apps with GitHub Pages.
- **Hapi** -
  By default, Reframe uses the robust and scalable server framework Hapi.
- **Express** -
  Add the @reframe/express plugin and implement your backend with Express.
- **Webpack** -
  By default, Reframes uses webpack to build static assets.
- **WebAssembly** -
  Reframe is based on the JavaScript ecosystem and embraces the WebAssembly future.

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


