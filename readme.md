<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.






-->
[<p align="center"><img src='https://github.com/brillout-test/reprop-test/blob/master/docs/logo/logo-title.svg' width=400 style=    "max-width:100%;" alt="Reprop"/></p>](https://github.com/brillout/reprop)
<br/>

[Introduction](/../../)<br/>
[Getting Started](/docs/getting-started.md)<br/>
[API](/docs/api.md)

Reframe, the web (anti-)framework. (A web framework with no lock-in.)


Reframe renders your React views on the server, and/or in the browser, and/or statically.
Reframe helps you create static websites, universal React apps, and other types of apps.
Reframe is designed with "adaptability" in mind (= no lock-in).

This introduction presents what Reframe is, how it's different from other web frameworks, and the Reframe project's scope.

# Introduction

Reframe allows you to define pages like this:

~~~js
// /example/pages/HelloPage.html.js

const React = require('react');

const HelloComponent = () => <div>Hello World</div>;

const HelloPage = {
    title: 'Hello there', // Page's title
    description: 'A Hello World page created with Reframe.',
    route: '/hello', // Page's URL
    view: HelloComponent,
    htmlIsStatic: true, // Let Reframe know that HelloPage's HTML is static.
};

module.exports = HelloPage;
~~~

And the `reframe` CLI serves the defined page:

~~~shell
$ reframe
✔ Page directory found at ~/code/@reframe/example/pages
✔ Frontend built at ~/code/@reframe/example/dist/browser/
✔ Server running at http://localhost:3000
~~~

The CLI command `reframe` searches for the `pages` directory, builds the frontend (webpack), and spins up a server (Node.js/hapi).

Once the frontend is built and the server up the source code of `http://localhost:3000/hello` is;

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Hello there</title>
        <meta name="description" content="A Hello World page created with Reframe.">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Hello World</div></div>
    </body>
</html>
~~~

This page is static but you can also create pages that are "HTML-dynamic" and "DOM-dynamic".
We will see in a bit what "HTML-dynamic" and "DOM-dynamic" mean.


#### Why Reframe?

Reframe is born out of the frustration of two conflicting intentions

 1. I want to use a framework to quickly implement a working prototype. And more importantly, I want to think about the application's architecture only later on and only if necessary rather than having to think through an entire app architecture before even starting writing one line of code.

 2. I don't want to use a framework because of its limitations. And more importantly, I don't want to get locked-in to that framework down the road.

One could ask oneself if it's possible to design a framework in a way that allows both a quick start and full flexbility down the road?

We call the notion of "full fexibility down the road" *adaptability* and such adaptable framework an (anti-)framework.

The Reframe project is born in the belief that an (anti-)framework is possible.

With reframe, it is framework that adapts to your needs, not your needs that adapt to the framework.


#### Why should I use Reframe?

If you want to quickly implement a working prototype without getting locked into the framework's limitations down the road.


#### Reframe Project Scope

With Reframe you can create pages that are:

 - **HTML-static**,
   <br/>
   where the page is rendered to HTML when building the frontend.
   <br/>
   (The HTML doesn't change. The HTML is rendered on "build-time".)
 - **HTML-dynamic**,
   <br/>
   where the page's HTML is rendered upon each HTTP request.
   <br/>
   (The HTML varies from request to request. The HTML is rendered on "request-time".)
 - **DOM-static**,
   <br/>
   where the page's DOM is not manipulated and React is only used to render HTML.
   <br/>
   (Reframe only uses `require('react-dom/server')`, `require('react-dom')` is not used and React doesn't get to manipulate the DOM.)
 - **DOM-dynamic**,
   <br/>
   where the page has React components that dynamically change in the browser.
   <br/>
   (Reframe uses `require('react-dom')` and React manipulates the DOM.)

You can create a universal app (i.e. a isomorphic app), i.e. apps that are rendered on both the server and the browser.

You can as well create a static React app (in other words a static website), that is, an app where all pages are HTML-static.
(When creating a static website/app, Reframe will generate all HTML at build-time and this means that no server code is required and you can publish your static app with GitHub pages or any other static website hosting.)

In general, you can create any combination of HTML-(static/dynamic) and DOM-(static/dynamic) pages.


Reframe takes care of;

 - **Routing**
   <br/>
   I.e. the mapping of a URL to a React component.
   <br/>
   Including:
    - Route parameters
      (Define routes such as `/user/{user-id}`.)
      <br/>
    - [Adaptable] Custom route logic
      <br/>
      (The route of a page can also be defined by providing functions that can implement any arbritary routing logic.)
    - [Adaptable] Arbitrary routing library
      <br/>
      (Reframe's default routing library is [Crossroads.js](https://github.com/millermedeiros/crossroads.js) but you can also choose another routing library.)


 - **Server**
   <br/>
   Reframe sets up a Node.js/hapi server that renders HTML-dynamic pages and that serves static browser assets.
   <br/>
    Including:
     - Optimal non-optimistic caching.
       <br/>
       (Mutable URLs are cached with the `ETag` header, static assets are served at immutable URLs and are indefinitely cached with `Cache-Control` header with `immutable` and the maximum value for `max-age`.)
     - [Adaptable] Custom CLI.
       <br/>
       The `reframe` CLI is just a thin wrapper over the NPM package `@reframe/server`.
       You can use `@reframe/server` directly instead of using the CLI.
       That way you can define your own command line interface, startup logic, and process management.
     - [Adaptable] Possibility to use Reframe as a hapi plugin.
       <br/>
       (That way you can create the hapi server yourself. Which is useful if for example you want to add GraphQL / RESTful API endpoints to the server.)
     - [Adaptable] Possibility to use Reframe with another server framework like Express, Koa, etc.

 - **Build**
   <br/>
   Reframe builds and bundles your frontend assets for you. (Reframe uses webpack. You can use a fully custom webpack configuration.)
   <br/>
   Including:
    - Code Splitting
      <br/>
      (Every page has its own script bundle. The common is extracted into a separate script bundle (containing mainly React and core-js).)
    - Auto-reload
      <br/>
      (Everytime you modify a file the bundle is re-compiled and the browser automatically reloads)
    - [Adaptable] You can use almost any arbitrary webpack configuration
      <br/>
      Reframe assumes almost nothing about the webpack configuration so that you can use almost any webpack configuration you want.


Reframe **doesn't** take care of;

 - View logic / state management.
   <br/>
   It's up to you to manage the state of your views yourself. (Or use Redux / MobX / [Reprop](https://github.com/brillout/reprop).)
 - Database.
   <br/>
   It's up to you to create, populate, and query databases.


#### Adaptability

Beyond the adaptable points described above, **Reframe is adaptable all the way down to Repage**.

Behind the curtain,
Reframe is built on top of Repage.
Repage is an agnostic low-level page management library.

Reframe is designed such that any part of Reframe can be replaced with code of your own.
You can even eventually get rid of Reframe altogether to then use Repage directly.

By replacing Reframe parts you can for example
 - [Adaptable] User a view library other than React
 - [Adaptable] User a build tool other than webpack

And to further push the adaptability envelop, Repage itself designed with adaptability in mind and
**Repage is adaptable all the way down to vanilla JavaScript**.

In overall, and if you are willing to replace parts of Reframe/Repage with your own code, every bit of this framework is adaptable to your needs.

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.






-->
