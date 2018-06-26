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
  Framework to create web apps.
</p>
<p align="center">
  &nbsp;&nbsp;<sub><sub><img src="https://github.com/reframejs/reframe/raw/docs/docs/images/thunderbolt.min.svg?sanitize=true" width="26" height="26"></sub></sub>&nbsp;&nbsp;&nbsp;<b>Rapid</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Implement&nbsp;apps&nbsp;in&nbsp;no&nbsp;time.
  <br/>
  <sub><sub><img src="https://github.com/reframejs/reframe/raw/docs/docs/images/tornado.min.svg?sanitize=true" width="26" height="26"></sub></sub>&nbsp;&nbsp;<b>Flexible</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Progressively&nbsp;ejectable.
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

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>

### Example

We create an app
by defining a page config `HelloPage`.

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

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

That's it: We created an entire web app simply by defining one page config. No build config, no server config.

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
You can easily add/remove a Node.js server and add/remove a database/ORM.

Quickly choose a starter and start write your prototype.
As your prototype grows add/remove what you need.

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

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
