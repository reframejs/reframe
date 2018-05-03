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
    <b>Universal</b>
    &nbsp;-&nbsp;
    Create static, dynamic and hybrid apps
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
  title: 'Welcome'
};

export default WelcomePage;
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component,
 - a route, and
 - further optional page configurations

You can create an app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

<br/>

Yet, **everything is customizable/ejectable**.

For example, the command `reframe eject server` ejects [~30 LOC of server code](/plugins/server/startServer.js):
The server code is copied from Reframe's codebase to your codebase.
Giving you control over the server and allowing you to add API endpoints, change the server config, use a process manager, etc.

There are several eject commands that you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

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
  title: 'Hi there', // Page's <title>
};

export default HelloPage;
~~~

Reframe does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

<br/>

The page config options

 - `htmlStatic: true`
   <br/>
   Render the page to HTML at build-time (instead of request-time).
   <br/>
   By default a page is re-rendered to HTML every time the user loads the page.
   By setting `htmlStatic: true` the page is rendered to HTML only once, when Reframe is builing your app's pages.
 - `domStatic: true`
   <br/>
   Do not render the page in the browser.
   <br/>
   By default a page is rendered twice: On the server to HTML and in the browser to the DOM.
   (React components can be rendered to the DOM as well as to HTML.)
   By setting `domStatic: true` the page is only rendered to HTML.

allow you to create

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Pages are rendered in the browser.
   <br/>
   The DOM is dynamic allowing you create interactive views.
   In other words views that update themselves in the browser with DOM manipulations (instead of loading an entire new page).
   <br/>
   (Pages are also rendered to HTML on the server.)
   <br/>
   This is the default.
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Pages are only rendered to HTML on the server.
   <br/>
   Pages are not rendered in the browser, the DOM is not manipulated, and the browser doesn't load any (or almost no) JavaScript.
   <br/>
   Opt-in by setting `domStatic: true` to all your page configs.
 - **Serverless apps**
   <br/>
   Pages are rendered to HTML at build-time.
   <br/>
   All pages are rendered to HTML only once, when Reframe is building the pages, and the HTML is served statically.
   <br/>
   Such app doen't need a Node.js server and can be deployed to a static host such as GitHub Pages or Netlify.
   <br/>
   Opt-in by setting `htmlStatic: true` to all your page configs.
 - **Hybrid apps**
   <br/>
   Some pages are DOM-static, some DOM-dynamic, some HTML-static, and some HTML-dynamic.
   <br/>
   That way you can create couple of pages that have interactive views while the rest of your app is non-interactive.
   Non-interactive views are considerably easier to implement and usually perform better.
   Hybrid apps allow the approach "Whenever possible, implement features with non-interative views".
   <br/>
   Opt-in by setting `htmlStatic: true` / `domStatic: true` to some of your page configs.

In short:

> You can create static apps, dynamic apps, and hybrid apps.

Changing the type of your app is merely a matter of adding/removing `htmlStatic: true` / `domStatic: true` to your page configs.

> You can start writing your app and only later decide the type of your app.

To sum up,
Reframe is **easy**, **universal** (you can create any type of web app), and **ejectable**.

<br/>

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
