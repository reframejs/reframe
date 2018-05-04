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
    <b>Ejectable</b>
    &nbsp;-&nbsp;
    No lock-in
    &nbsp;&nbsp;
    &nbsp;&nbsp;
    <b>Universal</b>
    &nbsp;-&nbsp;
    Create static, dynamic and hybrid apps
</p></div>

<br/>

[**Overview**](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Plugins](/docs/plugins.md)

<h1>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Overview
</h1>

<br/>

<div><p align="center">
<a href="#easy">Easy</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#example">Example</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#quick-start">Quick Start</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#ejectable">Ejectable</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#universal">Universal</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#tech-specs">Tech Specs</a>
</p></div>

### Easy

Reframe allows you to create web apps by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

~~~jsx
// A page config
const WelcomePage = {
  route: '/',
  view: () => <div>Welcome to Reframe</div>,
  title: 'Welcome'
};
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component,
 - a route, and
 - further optional page configurations

You can create an app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

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
    // Our route argument `name` is available at `props.route.args.name`
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
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

That's it: We created a web app by simply defining one page config.

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

To familiarize yourself with Reframe,
read the source code of `my-app/`,
check out the [Usage Manual](/docs/usage-manual.md),
and read this overview.

<br/>

### Ejectable

**Everything is customizable/ejectable**.

For example, the command `reframe eject server` ejects [~30 LOC of server code](/plugins/server/startServer.js):
The server code is copied from Reframe's codebase to your codebase.
Giving you control over the server and allowing you to add API endpoints, change the server config, use a process manager, etc.

There are several eject commands that you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

<br/>

### Universal

Reframe is universal (you can create any type of web app)
thanks to two page config options: `htmlStatic: true` and `domStatic: true`.

By default a page is rendered twice:
On the server (to HTML) and in the browser (to the DOM).
(React components, and therefore the entire page as well, can be rendered to the DOM as well as to HTML.)

Because it is rendered in the browser, a page can have interactive views
(a like button, a realtime graph, a To-Do list, etc.).
But if a page has no interactive views then it is wasteful to render it in the browser.
By adding `domStatic: true` to its page config, the page is only rendered on the server.
The browser loads no (or almost no) JavaScript and the DOM is static.

By default a page is dynamically rendered to HTML at request-time.
But some pages are static
(a landing page, a blog post, a personal homepage, etc.) and it would be wasteful to re-render its HTML on every page request.
By adding `htmlStatic: true` to a page config, the page is rendered to HTML at build-time instead.

Thus, you can create:

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup> - Apps with interactive views. (The DOM is dynamic.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup> - Apps without interactive views. (The DOM is static.)
 - **Serverless apps** - Apps with static HTML. (No Node.js server is needed as all pages' HTML are rendered at built-time.)
 - **Hybrid apps** - Apps where some pages have a static HTML and some have a static DOM.

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
