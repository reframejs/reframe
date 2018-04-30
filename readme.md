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
<div><p align="right"><sup>
    <a href="#">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/star.svg?sanitize=true"
          width="16"
          height="12"
        >
    </a>
    Star if you like
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://twitter.com/reframejs">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/twitter-logo.svg?sanitize=true"
          width="15"
          height="13"
        >
        Follow on Twitter
    </a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://discord.gg/kqXf65G">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/online-icon.svg?sanitize=true"
          width="14"
          height="10"
        >
        Chat on Discord
    </a>
</sup></p></div>

[<p align="center"><img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/reframejs/reframe)

<div><p align="center">
        Framework to create web apps with React
</p></div>

<div><p align="center">
    <b>Easy</b>
    &nbsp;-&nbsp;
    Create apps with page configs
    &nbsp;&nbsp;
    &nbsp;&nbsp;
    &nbsp;&nbsp;
    <b>Universal</b>
    &nbsp;-&nbsp;
    Create static and dynamic apps
    &nbsp;&nbsp;
    &nbsp;&nbsp;
    &nbsp;&nbsp;
    <b>Ejectable</b>
    &nbsp;-&nbsp;
    No lock-in
</p></div>

<br/>

[**Overview**](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Plugins](/docs/plugins.md)

<br/>

# Overview

##### Contents

 - [What is Reframe](#what-is-reframe)
 - [Tech Specs](#tech-specs)
 - [Quick Start](#quick-start)


### What is Reframe

Reframe allows you to create web apps by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

~~~jsx
// A page config example

const WelcomePage = {
  route: '/',
  view: () => <div>Welcome to Reframe</div>,
  title: 'Welcome' // Page's <title>
};

export default WelcomePage;
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component,
 - a route, and
 - further optional page configurations

You can create a React web app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

<br/>

Yet, **everything is customizable/ejectable**.

For example, the command `reframe eject server` ejects the server code:
The server code is copied from Reframe's codebase to your codebase.
Giving you control over the server code allowing you to add API endpoints, change the server config, use a process manager, etc.

There are several eject commands that you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Rreframe doesn't lock you in: You can progressively and fully eject Reframe.

<br/>

In the following we create a web app
by defining a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

import React from 'react';

const HelloComponent = (
  props => {
    // Our route argument `name` is available at `props.route.args.name`
    const name = props.route.args.name;
    return (
      <div>Hello {name}</div>
    );
  }
);

const HelloPage = {
  route: '/hello/:name', // Parameterized route
  view: HelloComponent,
  title: 'Hi there',
};

export default HelloPage;
~~~

Reframe does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

<br/>

Page configs have two options `htmlStatic: true` and `domStatic: true`
that allow you to create a wide variety of apps:

 - `htmlStatic: true`
   <br/>
   Render the page's HTML at build-time (and not at request-time).
   <br/>
   Render the page's HTML once The user loads the page.
   Every time the user requests a page, the page's HTML is rerendered. 
   Your pages are rendered to HTML every time the user
 - `domStatic: true`
   <br/>
   Only render 
   Besides being rendered to HTML your pages are as well rendered to the DOM in the browser
   Your pages are rendered in the browser allowing you to create interactive views:
   Views that change depending on user actions.
   By setting `domStatic: false` 

Allowing you to create

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with a dynamic DOM.
   <br/>
   You create React components to implement interactive views.
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps with a static DOM.
   <br/>
   You create React components to generate HTML.
   <br/>
   No (or almost no) JavaScript is loaded in the browser.
   <br/>
   (Besides being used to create interative views in the browser, React can as well be used as a powerful HTML template engine on the server.)
   <br/>
   Opt-in by setting `domStatic: true` to all your page configs.
 - **Serverless apps**
   <br/>
   Apps with static HTML.
   <br/>
   The HTML of all pages are rendered statically at build-time.
   <br/>
   The DOM can be static (static website) or dynamic (serverless interactive app).
   <br/>
   These apps don't need a Node.js server and can be deployed to a static host such as GitHub Pages or Netlify.
   <br/>
   Opt-in by setting `htmlStatic: true` to all your page configs.
 - **Hybrid apps**
   <br/>
   Apps with both static and dynamic HTML/DOM.
   <br/>
   Some pages are DOM-static, some DOM-dynamic, some HTML-static, and some HTML-dynamic.
   <br/>
   That way you can create couple of pages with interactive views while the rest of your app is non-interactive.
   Non-interactive views are considerably easier to implement and usually perform better.
   Hybrid apps allow the approach "Whenever possible, implement features with non-interative views".
   <br/>
   Opt-in by setting `htmlStatic: true` / `domStatic: true` to some of your page configs.

> With Reframe you can create dynamics apps, static apps, and hybrid apps.

### Tech Specs

- **Server-Side Rendering** (**SSR**) for SEO and improved speed
  <br/>
  By default all pages are rendered to HTML on the server
  and hydrated in the browser.
  <br/>
  Giving you full control over SEO and improving the user perceived load time.
- **React Router**
  <br/>
  The syntax of the page config's `route` string is the same than in React Router v4.
  <br/>
  And by adding the [@reframe/react-router](/plugins/react-router) plugin
  you can use React Router's components `<Route>`, `<Switch>`, etc.
- **TypeScript**
  <br/>
  Add the [@reframe/typescript](/plugins/typescript) plugin and write your app in TypeScript.
- **PostCSS**
  <br/>
  Add the [@reframe/postcss](/plugins/postcss) plugin to write modern CSS.
- **Webpack**
  <br/>
  Reframe uses webpack to build the app's pages.
  Webpack
  ([webpack.js.org](https://webpack.js.org/))
  is the state of the art to build browser assets.
- **Hapi**
  <br/>
  Reframe uses hapi to create the server.
  Hapi
  ([hapijs.com](https://hapijs.com/))
  is known for its robustness and scalability.
- **Code-splitting** for improved speed
  <br/>
  By default a page loads two scripts:
  One script that is shared and cached across all pages
  (that includes React, polyfills, etc.)
  and a second script that includes the React components of the page.
  That way, a page only loads what it needs.
- **Static DOM** for improved speed
  <br/>
  When setting `domStatic: true` to a page config, the page is not hydrated.
  (In other words, the page's view is not rendered to the DOM but only rendered to HTML.)
  Not only is computational time saved by skiping rendering to the DOM but also load time is saved by skipping loading JavaScript code.
- **Optimal HTTP caching** for improved speed
  <br/>
  Every dynamic server response is cached with a ETag header.
  And every static server response is indefinitely cached.
  (A static asset is served under a URL that contains the assets' hash
  and is served with the `Cache-Control` header set to `immutable` and `max-age`'s maximum value.)
- **Static Rendering** for improved speed
  <br/>
  When setting `htmlStatic: true` to a page config, the page is rendered to HTML at build-time (instead of request-time).
  The page's HTML is rendered only once, when Reframe is building the pages, and is served statically.
  Decreasing load time.

### Quick Start

1. Install the Reframe CLI.

~~~shell
$ npm install -g @reframe/cli
~~~

2. Initialize a new Rreframe app.

~~~shell
$ reframe init my-app
~~~

A `my-app/` directory is created and populated with a sample Reframe app.

3. Build the pages and start the server.

~~~shell
$ cd my-app
$ reframe start
~~~

4. Open [http://localhost:3000](http://localhost:3000).

Read the source code of `my-app/` and check out the [Usage Manual](/docs/usage-manual.md) to familiarize yourself with Reframe's usage.

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
