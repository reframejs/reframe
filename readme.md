<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.






-->
<p align="right">
    <sup>
        <a href="#">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/star.svg?sanitize=true"
              width="16"
              height="12"
            >
        </a>
        Star if you like
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://github.com/reframejs/reframe/blob/master/docs/contributing.md">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/biceps.min.svg?sanitize=true"
              width="16"
              height="14"
            >
            Co-maintain Reframe
        </a>
    </sup>
    <br/>
    <sup>
        <a href="https://twitter.com/reframejs">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/twitter-logo.svg?sanitize=true"
              width="15"
              height="13"
            >
            Follow on Twitter
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://discord.gg/kqXf65G">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/chat.svg?sanitize=true"
              width="14"
              height="10"
            >
            Chat on Discord
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
    </sup>
</p>
<br/>
<br/>
<p align="center">
  <a href="https://github.com/reframejs/reframe">
    <img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.min.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/>
  </a>
</p>

<p align="center">
  &nbsp;Framework to create web apps.
</p>
<p align="center">
  &nbsp;&nbsp;&nbsp;<sub><sub><img src="https://github.com/reframejs/reframe/raw/master/docs/images/thunderbolt.min.svg?sanitize=true" width="26" height="26"></sub></sub>&nbsp;&nbsp;<b>Rapid</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Implement&nbsp;apps&nbsp;in&nbsp;no&nbsp;time.
  <br/>
  <sub><sub><img src="https://github.com/reframejs/reframe/raw/master/docs/images/tornado.min.svg?sanitize=true" width="26" height="26"></sub></sub>&nbsp;&nbsp;<b>Flexible</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Progressively&nbsp;ejectable.
</p>

<br/>
<br/>
<br/>

[**Overview**](/../../)<br/>
Starters: [React Server](/docs/react-server-starter.md) | [React Frontend](/docs/react-frontend-starter.md) | [React Database](/docs/react-database-starter.md)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Concepts](/docs/concepts.md)<br/>
[Plugins](/docs/plugins.md)

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

Yet, Reframe is progressively ejectable.

This means:
 - You can take control over everything.
 - **No lock-in**.
 - Quickly implement a prototype while staying fully flexible down the road.

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

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

<br/>

<br/>

### Example

We define a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

// By default you write your views with React.
// You can use another view library such as Vue.
import React from 'react';

const HelloPage = {
  route: '/hello/:name', // Parameterized route
  title: 'Hi there', // Page's <title>
  view: props => {
    // The route argument `name` is available at `props.route.args`
    const name = props.route.args.name;
    return (
      <div>Hello {name}</div>
    );
  }
};

export default HelloPage;
~~~

That's it.
We created an entire web app simply by defining one page config.
No build config, no server config.

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>

### Getting Started

Choose a starter:

- [React Server](/docs/react-server-starter.md)
- [React Frontend](/docs/react-frontend-starter.md)
- [React Database](/docs/react-database-starter.md) (Work-in-progress)

They scaffold the following:

&nbsp; | React Frontend | React Server | React Database
--- | :---: | :---: | :---:
React Frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js Server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

Don't bother choosing the right starter:
You can easily add/remove a Node.js server and add/remove a database/ORM afterwards.
Instead, quickly choose a starter and start write your prototype.
As your prototype grows add/remove what you need.

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

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

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>



<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.






-->
