!INLINE ./logo.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10



# Overview

##### Contents

 - [What is Reframe](#what-is-reframe)
 - [Why Reframe](#why-reframe)
 - [The Future of React](#the-future-of-react)
 - [Reframe Project Scope](#reframe-project-scope)
 - [Quick Start](#quick-start)



### What is Reframe

Reframe allows you to create web apps by defining pages.
Reframe then takes care of the rest: It automatically transpiles, bundles, serves, and routes your pages.

A page is defined by a plain JavaScript object called *page config*.

~~~js
// We create a landing page by defining a page config `LandingPage`:
const LandingPage = {
    route: '/', // Page's URL
    view: () => <div>Welcome to Reframe</div>, // Page's root React component
    title: 'Welcome' // Page's <title>
};
~~~

A page config configures a page by assigning it
 - a React component (required),
 - a route (required), and
 - further (optional) page configurations (such as the page's &lt;title&gt;, meta tags, script tags, whether the page should by hydrated or not, whether the page's HTML should be rendered at build-time or at request-time, etc.).

You can build a React web app with **no build configuration** and **no server configuration**.
**All you need to create a web app is one React component and one page config per page.**
And, if you need to, **everything is customizable**.
For example, you can customize the transpiling & bundling, the server, the browser entry, the Node.js entry, etc.

By defining page configs you can easily create:

 - **Server-side rendered React apps**
 <br/>
 Apps where pages are rendered to HTML on the server at request-time.

 - **HTML-static React apps**
 <br/>
 Apps where all pages are rendered to HTML at build-time.
 These apps don't need a Node.js server and can be deployed to a static website hosting such as GitHub Pages or Netlify.

 - **DOM-static React apps**
 <br/>
 Apps where the DOM is static and React is only used to render HTML.
 No (or almost no) JavaScript is loaded in the browser.

 - **Every kind of React app**
 <br/>
 Pretty much all kinds of app can be created.
 Reframe generates a certain type of app depending on how you configure your pages.
 For example, if you add `htmlIsStatic: true` to a page config, then that page's HTML is rendered at build-time instead of request-time.
 So, creating an HTML-static React app is simply a matter of setting `htmlIsStatic: true` to all page configs.
 An app can be a mix: Some pages can be HTML-static, some HTML-dynamic, some DOM-static, and some DOM-dynamic.

In the following we create a web app by defining a page config `HelloPage`.

~~~js
// ~/tmp/reframe-playground/pages/HelloPage.html.js

!INLINE ../example/pages/HelloPage.html.js --hide-source-path
~~~

The `reframe` CLI does the rest:

<p align="center">
    <img src='https://gitlab.com/brillout/reframe/raw/master/docs/screenshots/reframe_overview_screenshot.png' width=1200 style="max-width:100%;"/>
</p>

The following happend:
 - Reframe searched for the `/pages` directory and found it at `~/tmp/reframe-playground/pages`
 - Reframe read the `/pages` directory and found our page config at `~/tmp/reframe-playground/pages/HelloPage.html.js`
 - Reframe used webpack to transpile `HelloPage.html.js` for the server and to create bundles for the browser.
 - Reframe started a hapi server serving all static browser assets and serving the page's HTML.

### Why Reframe

Reframe has been designed with a focus on
 - Ease of Use
 - Universality
 - Customization
 - Performance

##### Ease of Use

Creating a React app is simply a matter of creating React components and page configs.
The "Quick Start" section bellow shows how easy it is.

##### Universality

Reframe allows you to configure a page to be
 - *HTML-static*, that is the page is rendered to HTML at build-time instead of request-time.
 - *DOM-static*, that is the page is not hydrated and the page's DOM is not manipulated.

This is gives you flexibility to implement a wide range of React app types, for example:
 - HTML-static apps
 - DOM-static apps
 - 95% DOM-static apps
 - Hybrid apps


Currently Reframe is the only React framework supporting all the aforementioned app types.

Instead of learning a different framework for each app type, you learn Reframe once to be able to write all types of apps.

For example, instead of having to learn Gatsby you can only learn Reframe.
Learn Reframe instead for example learn Gatsby for HTML-static React apps and Next.js learning for HTML-dynamic React apps,

React all
Current React frameworks 
But segragated:
you have tools (e.g. Gatsby) to create HTML-static apps or server-rendered apps (e.g. Next.js) but none of the frameworks allow the whole spectrum of apps
You have to learn two frameworks to create. When learning Reframe instead, 

 - 50% HTML-static apps
 - 95% DOM-static apps

Example of apps that can't be created with current frameworks
 - 95% static-

Reframe aims to be universal by supporting all types of React apps.
Reframe aims to be universal: 

##### Customization

Reframe's basic usage is designed to be as easy as possible.
But Reframe also supports customization.
While many customizations are easy to achieve,
Reframe allows "full customization": virtually everything is customizable.

Examples of customizations that are easy to achieve:
 - Custom server
   - Add server routes to create RESTful/GraphQL API endpoints, authentication endpoints, etc.
   - Custom hapi server config. (Reframe, by default, uses the hapi server framework.)
   - Use a process manager such as PM2.
   - etc.
 - Custom browser JavaScript
   - Add error logging, analytics logging, etc.
   - Full control of the hydration process.
   - etc.
 - Custom transpiling & bundling
   - Reframe can be used with almost any webpack config. (Reframe assumes pretty much nothing about the webpack config.)
   - TypeScript support
   - CSS preprocessors support, such as PostCSS, SASS, etc.
   - etc.
 - Custom routing library. (Reframe uses Crossroads.js by default.)
 - Custom view library such as Preact.
 - etc.

Beyond these easy customizations,
Reframe is designed with "full customization" in mind:
Reframe consists of three packages:
`@reframe/build` that transpiles and bundles,
`@reframe/server` that creates the server,
`@reframe/browser` that hydrates the page in the browser,
and each of these packages can be replaced with code of your own.
This means that, if you replace all these three packages with your own code, you effectively get rid of Reframe.

Examples of customization achievable by replacing Reframe packages:
 - Custom server framework, such as Express, Koa, etc. (Reframe uses hapi by default)
 - Custom build tool, such as Rollup (Reframe uses webpack by default)
 - etc.

##### Performance

- Code splitting.
  <br/>
  Every page loads two scripts:
  A script shared and cached accross all pages that include common code such as React and polyfills,
  and a (typically lightweight) script that is specific to the page.
  This means that a page requiring KB-heavy libraries won't affect the KB-size of other pages.
- Optimal HTTP caching.
  <br/>
  Every dynamic server response is cached with a Etag header, and
  every static server response is indefinitely cached.
  (Static assets are served under hashed URLs with the `Cache-Control` header set to `immutable` and `max-age`'s maxium value.)
- DOM-static pages.
  <br/>
  A page can be configured to be rendered only on the server.
  These pages are faster to load as React is not loaded in the browser and the page isn't hydrated.
- Partial DOM-dynamic pages.
  <br/>
  A page can be configured so that only certain parts of the page are hydrated.
  This makes the hydration of the page quicker. And less JavaScript is loaded in the browser, as the browser only loads the React components of the hydrated parts.
- HTML-static pages.
  <br/>
  A page can be configured to be rendered to HTML at build-time instead of request-time.
  In other words, the page is rendered to HTML only once, namely when Reframe is transpiling & bundling.
  The HTML is statically served, hence decreasing load time.
- SSR.
  <br/>
  All pages are defaulty rendered to HTML, decreasing the (perceived) load time.



### The future of React

> **TL;DR**
> - React is going to increasingly be used to implement for non-interactive views.
> - React may very well become the de facto universal view library.
> - Reframe embraces and encourages non-interactive views.

###### React and non-interactive views

React is more and more used to create non-interactive apps.
This trend may sound odd at first, since React is a library for creating interactive views.

Why would we want to use React to create a non-interactive view?

Let's imagine a software engineering team that wants to implement a web app that has no interactive view (in other words all views are DOM-static)  .
What platform should the team use to implement that web app?
It would seem natural to choose a platform regardless of its support for interactive views.
The team could for example use Ruby on Rails despite the fact that RoR doesn't direclty support interactive views.
If the team knows that it won't have to implement interactive views in the future,
then that would be a legitimate choice.
But that's the twist;
It is likely that at some point in the future a new project (requirement) will require an interactive view.
At this point the dev team will have no choice than to acquire knowledge about JavaScript and a view library such as React.
If the team would have chosen JavaScript & React in the first place instead, they would have spared themselves the time to get to know a new platform.

Beyond the "learn once, write anywhere" argument, JavaScript & React has several important advantages:
 - React is universal: It can target the DOM, HTML, native, etc.
 - React can create both interactive views and non-interactive views
 - Using React as a HTML templating engine is superior to any declarative template engine.
 - JavaScript is a popular, performant, and rapidly evolving language.
 - JavaScript/WebAssembly is the only runtime that can run in the browser.
 - WebAssembly may become the universal runtine that programmers always dreamed of.
 - Ability to choose from a high variety of languages that compile to JavaScript/WebAssembly

So, JavaScript & React is a good choice for non-interactive web apps as well.
We expect the React adoption in the non-interactive views space to considerably increase.

Ten years ago Jeff Atwood predicted that "Any application that can be written in JavaScript, will eventually be written in JavaScript.".
The same may very well happen to React:

> Any UI that can be written with React, will eventually be written with React.

Reframe embraces that future by making it easier to implement a web app with React and by supporting DOM-static web apps.

> Reframes treats both interactive (DOM-dynamic) web apps and non-interactive (DOM-static) web apps as first-class citizens.

###### DOM-static views VS DOM-dynamic views

Another trend in web development is to make views interactive (in other words DOM-dynamic) only if necessary.
In the past, we had the tendency to jump on the interactive views bandwagon too easily.
Over time, we learned that DOM-dynamic views are, by nature, significantly more difficult to implement than DOM-static views.

Therefore:

> Views should be made interactive only if necessary

That said, interactive views are perfectly fine,
and Reframe allows you to easily create interactive views as well as non-interactive views.
But we encourage to implement requirements with non-interactive views when possible.

Beyond non-interactive views being easier to implement,
they are also more performant:
no browser-side JavaScript needs to be loaded and the DOM doesn't need to be manipulated.


> Reframe encourages you to implement a majority of your web app with DOM-static views and only use DOM-dynamic views where necessary.



### Reframe Project Scope

When creating an app, Reframe takes care of:

 - **Build**
   <br/>
   Transpiles and bundles the browser static assets. (Uses webpack.)
 - **Server**
   <br/>
   Sets up a Node.js server serving the browser static assets and your pages' HTML. (Uses hapi.)
 - **Routing**
   <br/>
   Routes URLs to your pages.

Reframe **doesn't** take care of:

 - View logic / state management
   <br/>
   It's up to you to manage the state of your views (or use Redux / MobX).
 - Database
   <br/>
   It's up to you to create, populate, and query databases.


### Quick Start

Let's create our first React app.
For that we create a page by creating a page config and a React component.

1. We first create a `pages/` directory:

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~

2. Then we create a new JavaScript file `~/tmp/reframe-playground/pages/HelloWorldPage.html.js` that exports a page config:

~~~js
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

4. And finally, we run the CLI:

~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
reframe
~~~

which prints

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Page directory found at ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

That's it: We have created our first React web app by simply creating one React Component and one page config.

The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains further information, including:
 - Loading async data
 - Creating apps and pages that are DOM-dynamic, DOM-static, HTML-static, and/or HTML-dynamic
