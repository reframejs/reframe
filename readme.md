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
              src="https://github.com/reframejs/reframe/raw/master/docs/images/muscle.png?sanitize=true"
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
              src="https://github.com/reframejs/reframe/raw/master/docs/images/online-icon.svg?sanitize=true"
              width="14"
              height="10"
            >
            Chat on Discord
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
    </sup>
</p>

[<p align="center"><img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/reframejs/reframe)

<div><p align="center">
        Framework to create web apps with React
</p></div>

<div><p align="center">
    <b>Easy</b>&nbsp;&#8209;&nbsp;Quickly&nbsp;implement&nbsp;apps
    &nbsp; &nbsp; &nbsp;
    <b>Progressive&nbsp;Eject</b>&nbsp;&#8209;&nbsp;No&nbsp;lock&#8209;in
    &nbsp; &nbsp; &nbsp;
    <b>Universal</b>&nbsp;&#8209;&nbsp;Create&nbsp;static&nbsp;/&nbsp;dynamic&nbsp;/&nbsp;mixed&nbsp;apps
</p></div>

<br/>

[**Overview**](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Plugins](/docs/plugins.md)

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

Reframe does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

<br/>
<br/>

### Quick Start

1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~

2. Initialize a new Rreframe app.
   ~~~shell
   $ reframe init my-app
   ~~~
   A `my-app/` directory is created and populated with a Reframe app scaffold.

3. Build the pages and start the server.
   ~~~shell
   $ cd my-app
   $ reframe start
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

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

###### Quick but flexible

Once you fully eject Reframe, your app will not depend on Reframe anymore, and will only depend on state-of-the-art and do-one-thing-and-do-it-well libraries.

Meaning that you have the same flexibility
as if you would implement your app from scratch on top of these do-one-thing-and-do-it-well libraries.

> Quickly implement a prototype. You can later then gain full flexibility by progressively ejecting Reframe.

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
 - **Mixed apps** :tm:
   <br/>
   Apps that mix both: Modern interactive pages <sup><sub>:sparkles:</sub></sup> as well as good ol' 1998 non-interative pages <sup><sub>:floppy_disk:</sub></sup>.

Instead of learning different frameworks for different types of apps,
learn Reframe to be able to write any type of web app.

> Learn once, write any app.

Reframe is the only framework that supports every type of web apps.

And choosing the type of your app is only a matter of setting the page config options `htmlStatic` and `domStatic`.
So you can start writing your app and decide only later the type of your app.
(Explanation at [Usage Manual - `domStatic` & `htmlStatic`](/docs/usage-manual.md#domstatic--htmlstatic).)

###### Mixed apps :tm:

With Reframe you can write an app that has both interactive and non-interactive pages.
For example a `/about` page that is static and non-interactive
(browser doesn't load any JavaScript and the DOM is static)
and a `/search` page that is dynamic and interactive
(browser loads React components and the DOM is dynamic).

Both are important:
 - **Interactive** views are **difficult** to implement **but powerful**.
 - **Non-interactive** views are considerably **easier** to implement.

In general, we recommand to follow the **non-interactive-by-default approach**:
Whenever possible, implement features with non-interative views.

> Mixed apps allow you to follow the non-interactive-by-default approach.

Mixed apps are the future of web development and Reframe is the only framework supporting them.

<br/>
<br/>

### Tech Specs

###### Developer Experience

- **Quick but flexible**
  <br/>
  Create an app simply by defining React components and page configs.
  And thanks to progressive eject, you stay fully in control of your app.
  More at [Progressive Eject](#progressive-eject).
- **Mixed apps** :tm:
  <br/>
  Implement apps with mostly non-interactive pages and only few interactive pages.
  Following the non-interactive-by-default approach.
  (Implement features with non-interative views whenever possible.)
  More at [Universal](#universal).
- **Learn once, write any app**
  <br/>
  Instead of learning different frameworks to create different types of apps,
  learn Reframe once to be able to implement any type of web app.
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
  <br/>
  Google successfully crawls DOM-dynamic pages only to a limited extend. In practice you need SSR for reliable SEO.

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
