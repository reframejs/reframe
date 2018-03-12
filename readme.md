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
    <img src="https://github.com/reframejs/reframe/raw/master/docs/images/online-icon.svg?sanitize=true" width="13" height="20"> Chat with Reframe author on <a href="https://discord.gg/kqXf65G">discord.gg/kqXf65G</a>
</sup></p></div>

[<p align="center"><img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/reframejs/reframe)

<div><p align="center">
        Framework to create web apps with React.
</p></div>

<div><p align="center">
    <b>Easy</b>
    -
    Create apps with page configs.
    &nbsp;&nbsp;&nbsp;
    <b>Universal</b>
    -
    Create all kinds of apps.
    &nbsp;&nbsp;&nbsp;
    <b>Escapable</b>
    -
    Easy & progressive escape.
</p></div>

<br/>

[Overview](/../../)<br/>
[Reframe Rationale](/docs/reframe-rationale.md)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Customization Manual](/docs/customization-manual.md)<br/>
[Plugins](/docs/plugins.md)

<br/>

# Overview

##### Contents

 - [What is Reframe](#what-is-reframe)
 - [Why Reframe](#why-reframe)
 - [Quick Start](#quick-start)


### What is Reframe

Reframe allows you to create web apps by defining so called "page configs".
Reframe then takes care of the rest: It automatically transpiles, bundles, routes, renders, and serves your pages.

~~~jsx
// We define a page config to create a page
const LandingPage = {
  // Page's URL
  route: '/',

  // Page's React component
  view: () => <div>Welcome to Reframe</div>,

  // Page's <title>
  title: 'Welcome'
};
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component (required),
 - a route (required), and
 - further (optional) page configurations (page's &lt;title&gt;, meta tags, whether the page's HTML should be rendered at build-time or at request-time, whether the page should be hydrated or not, etc.).

You can create a React web app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

Let's create a web app by defining a page config `HelloPage`:

~~~jsx
// ~/tmp/reframe-playground/pages/HelloPage.html.js

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
  // Reframe follows the same route string syntax than React Router.
  // React Router's components `<Route>`, `<Switch>`, etc. can be used
  // by adding the plugin `@reframe/react-router`.
  route: '/hello/:name',

  // Page's React component
  view: HelloComponent,

  // Page's <title>
  title: 'Hi there',
};

export default HelloPage;
~~~

The `reframe` CLI does the rest:

<p align="center">
    <img src='https://github.com/brillout/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

Reframe did the following:
 - Reframe searched for a `pages/` directory and found one at `~/tmp/reframe-playground/pages`.
 - Reframe read the `pages/` directory and found our page config at `~/tmp/reframe-playground/pages/HelloPage.html.js`.
 - Reframe used webpack to transpile `HelloPage.html.js`.
 - Reframe started a Node.js/hapi server serving all static assets and rendering and serving our page's HTML.

With Reframe you can create:

 - **Server-side rendered apps**
   <br/>
   Apps where pages are rendered to HTML on the server.
 - **Static apps**
   <br/>
   Apps where pages are rendered to HTML at build-time.
   <br/>
   These apps don't need a Node.js server and can be deployed to a static website hosting such as GitHub Pages or Netlify.
 - **DOM-static apps**
   <br/>
   Apps where the DOM is static and React is only used to render HTML.
   <br/>
   No (or almost no) JavaScript is loaded in the browser.
 - **Hybrid apps**
   <br/>
   Apps with mixed page types:
   Some pages are rendered to HTML at build-time and others at request-time, and some pages have a static DOM while others have a dynamic DOM.

Reframe generates a certain type of app depending on how you configure your pages.
For example, if you add `htmlStatic: true` to a page config, then that page's HTML is rendered at build-time instead of request-time.
So, creating a static app is simply a matter of setting `htmlStatic: true` to all page configs.

The "Quick Start" section below gives a step-by-step guide to create a React app with Reframe.


### Why Reframe

 - **Easy**
   <br/>
   Create web apps by simply defining page configs and React components.
   The Quick Start section below shows how easy it is.
 - **Universal**
   <br/>
   Reframe is the only framework that supports all types of apps.
   Instead of learning different frameworks to create different types of apps,
   you learn Reframe once to be able to create all types of apps.
 - **Escapable**
   <br/>
   Most of your code (~95%-99%) will be entirely independent of Reframe.
   This means that, if you decide to get rid of Reframe, you will have to rewrite only ~1%-5% of your code.
   The [Reframe Rationale](/docs/reframe-rationale.md) explains why.
 - **Plugins**
   <br/>
   Plugins can modify Reframe to a great extent.
   There are plugins for using Reframe with React Router v4, TypeScript, PostCSS, etc.
 - **Customizable**
   <br/>
   Reframe allows you to easily and fully customize the webpack config, the server, the browser entry, the Node.js entry, the routing, etc.
 - **Performance**
   <br/>
   Reframe creates high performance apps by doing
   code splitting,
   optimal HTTP caching,
   by pre-rendering pages to HTML,
   and by statically rendering views.

The [Reframe Rationale](/docs/reframe-rationale.md) explains these perks in more detail.



### Quick Start

Let's create a React app with Reframe.

1. We create a `pages/` directory:

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~

2. Then, we create a new JavaScript file at `~/tmp/reframe-playground/pages/HelloWorldPage.html.js` that exports a page config:

~~~jsx
import React from 'react';

const HelloWorldPage = {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
        </div>
    ),
};

export default HelloWorldPage;
~~~

3. We install Reframe's CLI and React:

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
npm install react
~~~

4. Finally, we run the CLI:

~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
reframe
~~~

which prints

~~~shell
$ reframe
✔ Page directory found at ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

Our page is now live at [http://localhost:3000](http://localhost:3000).

That's it: We have created a web app by simply creating one React Component and one page config.

The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains further information, including:
 - How to add CSS and static assets.
 - How to link pages.
 - How to configure pages that need to (asynchronously) load data.
 - How to configure pages to be DOM-dynamic or DOM-static, and HTML-static or HTML-dynamic.

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
