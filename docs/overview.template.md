Reframe, the web (anti-)framework &mdash; quickly implement an app, without lock-in.

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

Reframe renders your React views on the server, and/or in the browser, and/or statically.
It helps you create static websites, universal React apps, SPAs, and other types of apps.
Reframe is designed so that it doesn't lock you in.

This overview presents what Reframe is, how it's different from other web frameworks, and the scope of the Reframe project.

# Overview

##### Contents

 - [What is Reframe?](#what-is-reframe)
 - [Why Reframe?](#why-reframe)
 - [Rreframe Project Scope](#reframe-project-scope)
 - [Adaptability](#adaptability)


### What is Reframe?

Reframe allows you to define pages like this:

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Running the `reframe` CLI serves the defined page:

~~~shell
$ reframe
✔ Page directory found at ~/tmp/reframe/example/pages
✔ Frontend built at ~/tmp/reframe/example/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

The CLI command `reframe` searches for the `pages` directory, builds the frontend (webpack), and spins up a server (Node.js/hapi).

The source code of `http://localhost:3000/hello/Alice` is then;

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Hi there</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Hello Alice</div></div>
    </body>
</html>
~~~

This page doesn't load any JavaScript code and its DOM is static.
But Reframe also allows you to create pages with a dynamic view.



### Why Reframe?

Reframe is born out of the frustration of two conflicting intentions

 - I want to use a framework so that I can quickly implement a prototype.
   I don't want to design an entire app architecture before even starting to write one line of code.

 - I don't want to use a framework because of the framework's limitations.
   And more importantly, I don't want to get locked into that framework down the road.

The question arises

 > Is it possible to design a framework that allows its user to quickly implement a prototype without locking the user in?

Reframe is born out of the belief that it is.

Reframe has been designed so that parts of Reframe can be overwritten.
This means that, if Reframe doesn't suit your need, you can re-write Reframe parts to suit your need.
You can even progressively over time replace all Reframe parts with code of your own and get rid of Reframe altogether.
This effectively means that Reframe is fully customizable.

We call the characteristic of being able to adapt to yours needs *adaptability*,
and we call such adaptable framework an *(anti-)framework*.



### Reframe Project Scope

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
   (Reframe only uses `require('react-dom/server')`, i.e. `require('react-dom')` is not used and React doesn't manipulate the DOM.)
 - **DOM-dynamic**,
   <br/>
   where the page has React components that dynamically change in the browser.
   <br/>
   (Reframe uses `require('react-dom')`, i.e. React manipulates the DOM.)

You can create universal apps (isomorphic apps), i.e. apps that are rendered on both the server and the browser.

You can as well create static React apps (i.e. static websites), that is, an app where all pages are HTML-static.
(When creating a static website/app,
Reframe will generate all HTML at build-time,
no server code is required,
and you can publish your static app with GitHub pages or
any other static website hosting.)

In general, you can create any combination of HTML-(static/dynamic) and DOM-(static/dynamic) pages.


Reframe takes care of;

 - **Routing**
   <br/>
   I.e. the mapping of a URL to a React component.
   <br/>
   Including:
    - Route parameters
      (Define routes such as `/user/{userId}`.)
      <br/>
    - [Adaptable] Custom route logic
      <br/>
      (The route of a page can also be defined by providing functions that can implement any arbritary routing logic.)
    - [Adaptable] Arbitrary routing library
      <br/>
      (Reframe's default routing library is [Crossroads.js](https://github.com/millermedeiros/crossroads.js) but you can also choose another routing library.)


 - **Server**
   <br/>
   Reframe sets up a Node.js/hapi server that renders HTML-dynamic pages and that serves the static browser assets.
   <br/>
    Including:
     - Optimal non-optimistic caching.
       <br/>
       (Mutable URLs are cached with the `ETag` header, static assets are served at immutable URLs and are indefinitely cached with `Cache-Control` header with `immutable` and `max-age`'s maxium value.)
     - [Adaptable] Custom CLI.
       <br/>
       The `reframe` CLI is just a thin wrapper over the NPM package `@reframe/server`.
       You can use `@reframe/server` directly instead of using the CLI.
       That way you can define your own command line interface, startup logic, and process management.
     - [Adaptable] Possibility to use Reframe as a hapi plugin.
       <br/>
       (That way you can create the hapi server yourself. Which is useful if for example you want to add GraphQL / RESTful API endpoints to the server.)
     - [Adaptable] Possibility to use Reframe with another server framework such as Express, Koa, etc.

 - **Build**
   <br/>
   Reframe builds and bundles your frontend assets for you. Reframe uses webpack.
   <br/>
   Including:
    - Code Splitting
      <br/>
      (Every page has its own script bundle. Common code is extracted into a separate script bundle.)
    - Auto-reload
      <br/>
      (Everytime you modify a file the bundle is re-compiled and the browser automatically reloads.)
    - [Adaptable] Arbitrary webpack configuration
      <br/>
      Reframe assumes almost nothing about the webpack configuration so that you can use almost any webpack configuration you want.


Reframe **doesn't** take care of;

 - View logic / state management.
   <br/>
   It's up to you to manage the state of your views yourself. (Or use Redux / MobX / [Reprop](https://github.com/brillout/reprop).)
 - Database.
   <br/>
   It's up to you to create, populate, and query databases.



### Adaptability

Beyond the [Adaptable] points mentioned above, **Reframe is adaptable all the way down to Repage**.

Behind the curtain,
Reframe is built on top of [Repage](https://github.com/brillout/repage).
Repage is an agnostic low-level page management library.

Reframe is designed such that any part of Reframe can be replaced with code of your own.
You can eventually even get rid of Reframe altogether to then use Repage directly.

By replacing Reframe parts you can for example
 - [Adaptable] User a view library other than React
 - [Adaptable] User a build tool other than webpack

And to further push the adaptability envelop, Repage is itself designed with adaptability in mind and
**Repage is adaptable all the way down to vanilla JavaScript**.

In overall, and if you are willing to replace parts of Reframe/Repage with your own code, every bit of this framework is adaptable to your needs.
