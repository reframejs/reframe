<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.






-->
<div><p align="right"><sup>
    <img src="https://github.com/brillout/reframe/raw/master/docs/images/online-icon.svg?sanitize=true" width="13" height="20"> Chat with Reframe author on <a href="https://discord.gg/kqXf65G">discord.gg/kqXf65G</a>
</sup></p></div>

[<p align="center"><img src="https://github.com/brillout/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/brillout/reframe)

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

# Reframe Rationale

The Reframe Rationale explains in details why someone would want to use Reframe.
This is Reframe's raison d'etre.

##### Contents

 - [Easy](#easy)
 - [Universal](#universal)
 - [Escapable](#escapable)
 - [Customizable](#customizable)
 - [Performant](#performant)


#### Easy

Creating a React app is simply a matter of creating React components and page configs.
And creating a certain type of app is simply a matter of configurating your page configs.


#### Universal

A fundamental aspect of the page config is that it allows you to configure a page to be what we call "HTML-static", "HTML-dynamic", "DOM-static" and "DOM-dynamic":
 - *HTML-static*
   <br/>
   The page is rendered to HTML at build-time.
   <br/>
   (In other words, the page is rendered to HTML only once, when Reframe is building the frontend.)
 - *HTML-dynamic*
   <br/>
   The page is rendered to HTML at request-time.
   <br/>
   (In other words, the page is (re-)rendered to HTML every time the user requests the page.)
 - *DOM-static*
   <br/>
   The page is not hydrated.
   <br/>
   (In other words, the DOM doesn't have any React component attached to it and the DOM will not change.)
 - *DOM-dynamic*
   <br/>
   The page is hydrated.
   <br/>
   (In other words, React components are attached to the DOM and the page's DOM will eventually be updated by React.)

This fine-grain control over the "static-ness" of your pages gives you the ability to implement all app types.

For example, you can create:
 - Server-side rendered apps.
   <br/>
   (In other words HTML-dynamic apps: All pages are configured to be HTML-dynamic.)
 - Static apps.
   <br/>
   (In other words HTML-static apps: All pages are configured to be HTML-static.)
   <br/>
   Since all pages are rendered to HTML at build-time, no Node.js server is needed.
   These apps can be deployed to static website hostings such as GitHub Pages or Netlify.
 - DOM-static apps.
   <br/>
   (In other words, apps where all pages are configured to be DOM-static.)
   <br/>
   Since the page is not hydrated, React is not loaded in the browser.
   No (or almost no) JavaScript is loaded in the browser.
 - Static websites.
   <br/>
   (In other words HTML-static and DOM-static apps: All pages are configured to be HTML-static and DOM-static.)
   <br/>
   These apps can be deployed to static website hostings as well.
 - Hybrid apps.
   <br/>
   An app can have pages of different types:
   Some pages can be configured to be HTML-static, some pages to be HTML-dynamic, some others to be DOM-static, and some to be DOM-dynamic.
   You can for example configure your landing page to be HTML-static and DOM-static,
   your product page to be HTML-dynamic and DOM-static,
   and your product search page to be HTML-static and DOM-dynamic.

Reframe is the only React framework that supports all app types.

> Instead of learning different frameworks to create different types of apps,
> you learn Reframe once to be able to create all types of apps.


#### Escapable

Every framework can be escaped from but the escape-cost can vary dramatically.
The escape-cost can be measured by two criteria:
 1. How much code can be re-used after the escape?
 2. How progressively can the framework be escaped?

For example, if no code can be re-used after escaping a framework, then that framework has a very high escape-cost.
In other words, that framework strongly locks you in.

Let's measure Reframe's escape-cost.

###### Code re-use after escape

Reframe is built on top of widely-used and high-quality "Do One Thing and Do It Well" (DOTADIW) libraries such as webpack, hapi, React, React Router, etc.

Reframe mostly gets out of the way between your code and these DOTADIW libraries:
With Reframe,
most of the code you write directly uses these DOTADIW libraries, independently of Reframe.

For example,
you would add RESTFul API endpoints by directly using hapi's interface.
The code implementing the RESTFul API is then entirely independent of Reframe and can be fully re-used after escaping Reframe.
(Technically Reframe is, on the server-side, mostly just a hapi plugin; Most of your server code will use hapi directly, know nothing about Reframe, and will be re-usable after escaping Reframe.)

> Most of your code can be re-used after escaping Reframe.

When worrying about framework lock-in, one of the main question to ask yourself is "am I writing code against an interface introduced by the framework or against an interface of a DOTADIW library?".
If the latter is the case, then you are not locking yourself into the framework.

###### Progressive escape

Reframe consists of three packages:
 - `@reframe/build` that transpiles code and bundles browser assets.
 - `@reframe/server` that creates the server.
 - `@reframe/browser` that handles the browser side and hydrates the page.

Each of these packages can be replaced with code of your own.

For example,
you can replace Reframe's server `@reframe/server` with your own server implementation.
At that point,
you have full control over the server,
while still using the rest of Reframe.

Similarly,
if you replace Reframe's build `@reframe/build` with your own build implementation,
then you have full control over the build step,
while still using the rest of Reframe.

> Reframe can be escaped in a progressive manner.

By replacing all these three packages with code of your own, you effectively escape Reframe entirely.

The Customization Manual explains how to escape from these three packages and includes examples such as:
 - Entirely custom build using Rollup (instead of webpack and by getting rid of `@reframe/build`).
 - Entirely custom server using Express (instead of hapi and by getting rid of `@reframe/server`).
 - Entirely custom browser-side code (by getting rid of `@reframe/browser`).

###### Meteor, the counter example

On the other side of the escape-cost spectrum, there is Meteor.

It consists of many parts that you can only use if you use the entire Meteor stack.
For example, you can use its build system or its server only if you use Meteor in its entirety.
This means that, if you want to escape Meteor, you will have to re-write all code related to these works-only-with-Meteor parts.

It has also not been designed with loosely coupled parts;
With Meteor, it's mostly either all-in or all-out.
In other words, you can't escape in a progressive manner.


#### Customizable

Reframe is designed with easy customization in mind,
and the following examples are easy to achieve:
 - Custom server
   - Add server endpoints: RESTful/GraphQL API endpoints, authentication endpoints, etc.
   - Custom hapi server config. (Reframe uses the hapi server framework by default.)
   - Use a process manager such as PM2.
   - etc.
 - Custom browser JavaScript
   - Add error logging, analytics, etc.
   - Full control of the hydration process.
   - etc.
 - Custom transpiling & bundling
   - Reframe can be used with almost any webpack config. (Reframe assumes pretty much nothing about the webpack config.)
   - TypeScript support
   - CSS preprocessors support, such as PostCSS, SASS, etc.
   - etc.
 - Custom routing library. (Reframe is based on React Router by default.)
 - Custom view library such as Preact.

The "Usage Manual" and "Customization Manual" documents cover these possibilites.


#### Performant

- **Code splitting**
  <br/>
  Every page loads two scripts:
  One script that is shared and cached across all pages
  (which includes common code such as React and polyfills)
  and a second script that includes the React components of the page.
  This means that a KB-heavy page won't affect the KB-size of other pages.
- **Optimal HTTP caching**
  <br/>
  Every dynamic server response is cached with a ETag header,
  and every static server response is indefinitely cached.
  (Static assets are served under hashed URLs with the `Cache-Control` header set to `immutable` and `max-age`'s maximum value.)
- **DOM-static pages**
  <br/>
  A page can be configured to be rendered only on the server.
  These pages are faster to load as the page isn't hydrated and
  React is not loaded in the browser.
- **Partial DOM-dynamic pages**
  <br/>
  A page can be configured so that only certain parts of the page are hydrated.
  This makes the hydration of the page quicker
  and less JavaScript is loaded in the browser.
  (Only the React components of the hydrated parts are loaded.)
- **HTML-static pages**
  <br/>
  A page can be configured to be rendered to HTML at build-time instead of request-time.
  In other words, the page is rendered to HTML only once, when Reframe is building the frontend.
  The HTML is statically served and the load time is decreased.
- **SSR**
  <br/>
  Pages are rendered to HTML before being hydrated, decreasing the (perceived) load time.



<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/reframe-rationale.template.md` instead.






-->
