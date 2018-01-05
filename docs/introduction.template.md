[<p align="center"><img src='https://github.com/brillout-test/reprop-test/blob/master/docs/logo/logo-title.svg' width=400 style=    "max-width:100%;" alt="Reprop"/></p>](https://github.com/brillout/reprop)
<br/>

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

Reframe, the web (anti-)framework. (A web framework with almost no lock-in.)


Reframe renders your React views on the server, and/or in the browser, and/or statically.
Reframe helps you create static React apps, universal React apps, and other types of apps.
Reframe is designed with "adaptability" in mind (= almost no lock-in).

# Introduction

This introduction presents what Reframe is, how it's different from other web frameworks, and the Reframe project's scope.
If you want to start use Reframe right away, check out the Getting Started section instead.

Reframe allows you to define pages like this:

~~~js
!INLINE ../example/pages/HelloPage.html.js
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
We will see in a bit what "HTML-dynamic" and "DOM-dynamic" means.


#### Why Reframe?

Reframe is born out of the frustration of two conflicting intentions

 1. I want to use a framework to quickly get a working prototype. And more importantly, I want to think about and develop the application's architecture later and only if necessary rather than having to think through an entire app architecture before even starting writing one line of code.

 2. I don't want to use a framework because of its limitations. And more importantly, I don't want to be locked-in to that framework down the road.

One could ask oneself whether it is possible or not to design a framework in a way that allows both a quick start and full flexbility down the road?

We call the notion of "full fexibility down the road" *adaptability* and such adaptable framework an (anti-)framework.

The Reframe project is born in the belief that an (anti-)framework is possible.

#### Why should I use Reframe?

If you want to quickly implement a working prototype without getting locked into the framework's limitations down the road.

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
   (Reframe only uses `require('react-dom/server')`, `require('react-dom')` is not used and React doesn't get to manipulate the DOM.)
 - **DOM-dynamic**,
   <br/>
   where the page has React components that dynamically change in the browser.
   <br/>
   (Reframe uses `require('react-dom')` and React manipulates the DOM.)

Among others you can create universal apps (isomorphic apps), i.e. apps that are rendered on both the server and the browser.
You can as well create static apps, i.e. apps where all pages are HTML-static.
And you can create any combination of HTML-(static/dynamic) and DOM-(static/dynamic) pages.


Reframe takes care of;

 - **Routing**.
   <br/>
   I.e. the mapping of a URL to a React component. (Reframe's default routing library is [Crossroads.js](https://github.com/millermedeiros/crossroads.js) but you can also choose another routing library and create your own route rules.)
   <br/>
   Including:
   - dynamic routes
 - **Server**.
   <br/>
   Reframe sets up a Node.js/hapi server to render your react pages to HTML. (But you can also use Reframe with your own server.)
   <br/>
    Including:
     - Optimal non-optimistic caching.
      <br/>
       (Mutable URLs are cached with the `ETag` header, static assets are served at immutable URLs and are indefinitely cached with `Cache-Control` header with `immutable` and the maximum value for `max-age`.)
     - [Adaptable] Possibility to use Reframe as a hapi plugin.
   You can use Reframe as a hapi plugin so that you can create the hapi server yourself. Which is useful if for example you want to add GraphQL / RESTful API endpoints to the server.
     - [Adaptable] Possibility to use Reframe with another server framework like Express, Koa, etc.

 - **Build**.
   <br/>
   Reframe builds and bundles your frontend assets for you. (Reframe uses webpack. You can use a fully custom webpack configuration.)
   <br/>
   Including
    - Code Splitting.
      <br/>
      (Every page has its own script bundle. The common is extracted into a separate script bundle (containing mainly React and core-js).)
    - Autoreload
      <br/>
      (.)
    - [Adaptable] full customization


Reframe **doesn't** take care of;

 - State management.
   <br/>
   It's up to you to manage the state of your app yourself. (Or use Redux / MobX / [Reprop](https://github.com/brillout/reprop).)
 - Database.
   <br/>
   It's up to you to create, populate, and query databases.


Reframe is adaptable;

 - **Custom server.**
   <br/>
   <br/>
   You can as well use any other server framework like Express, Koa, etc.
 - **Custom webpack configuration.**
   <br/>
   Reframe assumes almost nothing about the webpack configuration so that you can use almost any webpack configuration you want.
 - **Custom CLI.**
   <br/>
   The `reframe` CLI is just a thin wrapper over the NPM package `@reframe/server`
   and you can use `@reframe/server` directly instead of using the CLI.
   That way you can define your own command line interface, startup logic, and process management.
 - **Customization all the way down to Repage.**
   <br/>
   Behind the curtain,
   Reframe is built on top of Repage.
   Repage is an agnostic low-level page management library.
   You can rewrite any part of Reframe.
   Eventually, you can get rid of Reframe altogether to then depend on Repage only.
   By rewriting parts of Reframe you can for example
   use another build tool other than webpack,
   use another view library other than React,
   etc.
