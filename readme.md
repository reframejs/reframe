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
        Framework to create web apps. The modern Django / Ruby on Rails.
</p></div>

<div><p align="center">
    <b>Rapid&nbsp;Dev</b>&nbsp;&#8209;&nbsp;Quickly&nbsp;implement&nbsp;apps.
    &nbsp; &nbsp; &nbsp;
    <b>Fully&nbsp;Flexible</b>&nbsp;&#8209;&nbsp;As&nbsp;flexible&nbsp;as&nbsp;using&nbsp;do-one-thing-do-it-well&nbsp;libraries.
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
 - [Fully Flexible](#fully-flexible)
 - [Tech Specs](#tech-specs)

<br/>
<br/>

### Introduction

With Reframe you can create web apps by simply defining so-called "page configs".
Your pages are then automatically built and served.

~~~jsx
// A page config
const WelcomePage = {
  route: '/',
  view: () => <div>Welcome to Reframe</div>
};
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component (or a Vue.js component),
 - a route, and
 - further optional page configurations

You can create an app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

Yet, thanks to its "Progressive Eject" feature and its simple architecture,
**you can easily customize and gain control over everything**.

Reframe is a "Universal Framework":
You can create any type of apps such as **modern interactive apps**
as well as **old-school non-interactive apps**.

Reframe aims to be the **"modern Django / Ruby on Rails"**:
 - Interactive views: First-class support for interactive views with React, Vue.js, etc.
 - Ejectabe: Gain full control by progressively ejecting the framework.
 - Full-stack ORM: No need to create API endpoints to access your data from the frontend. (Work-in-progress.)
 - Easy deploy: "Serverless deploy" with serverless Node.js and serverless database. (Work-in-progress.)

<br/>
<br/>

### Example

We create a web app
by defining a page config `HelloPage`:

~~~jsx
// ~/my-app/pages/HelloPage.config.js

// Reframe uses React by default.
// You can as well use another view library such as Vue.js.
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
   A `my-app/` directory is created and populated with a scaffold.

3. Build the pages and start the server.
   ~~~shell
   $ cd my-app
   $ reframe start
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

To familiarize yourself with Reframe,
read the source code in `my-app/`,
read this overview, and
check out the [Usage Manual](/docs/usage-manual.md).

<br/>
<br/>

### Fully Flexible

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
Allowing you to modify the server code
so that you can for example
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
   (An interactive graph, an interactive table, a To-Do list, etc.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps without interactive views.
   (The DOM is static and the browser doesn't load any JavaScript.)
 - **Mixed apps** :tm:
   <br/>
   Apps that mix both: Modern interactive pages <sup><sub>:sparkles:</sub></sup> as well as good ol' 1998 non-interative pages <sup><sub>:floppy_disk:</sub></sup>.

The cherry on the cake is that choosing the type of your app is simply a matter of setting the page config options `htmlStatic` and `domStatic`.
This means that you can start writing your prototype and decide only at a later point what type of app is right for you.

> Reframe is the only framework that supports every type of web apps.

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
  Reframe introduces a new type of apps we call "mixed apps".
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
  Reframe is the only framework that supports every type of web apps.
  <br/>
- **ORM** [WIP]
  <br/>
  To use an ORM (such as [TypeORM](https://github.com/typeorm/typeorm)) you will have to create API endpoints yourself.
  But the Reframe devS are currently designing ways to automatically create these.
  <br/>
  Work-in-progress. ([Follow Reframe on Twitter](https://twitter.com/reframejs) to get updates.)
  <br/>
- **User Mangement** [WIP]
  <br/>
  Once Reframe integrates with ORMs, Reframe will be able to fully manage user management for you.
  <br/>
  Work-in-progress. ([Follow Reframe on Twitter](https://twitter.com/reframejs) to get updates.)
- **Easy Deploy** [WIP]
  <br/>
  If your app is static you can easily deploy it by using `$ reframe deploy-static`.
  (Supports all static hosts that have a git integration such as GitHub Pages, Netlify, Firebase, etc.)
  <br/>
  Also, Reframe is exploring ways to automatically deploy apps
  with serverless services such as AWS Lambda and
  serverless databases such as AWS DynamoDB or Google Cloud Datastore.
  <br/>
  This would mean that the entire deployment and scaling is done for you.
  <br/>
  Work-in-progress. ([Follow Reframe on Twitter](https://twitter.com/reframejs) to get updates.)


###### SEO

- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, all pages are rendered to HTML which gives you full control over SEO.
  <br/>
  (Google successfully crawls DOM-dynamic pages only to a limited extend, and
  in practice you need SSR for reliable SEO.)

###### Integrations

- **React**
  <br/>
  By default, you define your page's views with React.
- **React Router**
  <br/>
  Use the React Router components (`<Route>`, `<Switch>`, etc.) by adding the `@reframe/react-router` plugin.
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
  By default, Reframe uses webpack to build the app's pages.
  Webpack
  is the state-of-the-art tool to build browser assets.
- **WebAssembly**
  <br/>
  WebAssembly is immensely promising and Reframe, being based on JavaScript and Node.js, embraces the WebAssembly future.

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
