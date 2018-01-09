Reframe, the web (anti-)framework. (A web framework without lock-in.)

[<p align="center"><img src='https://github.com/brillout-test/reprop-test/blob/master/docs/logo/logo-title.svg' width=400 style="max-width:100%;" alt="Reprop"/></p>](https://github.com/brillout/reprop)
<br/>

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

Reframe renders your React views on the server, and/or in the browser, and/or statically.
Reframe helps you create static websites, universal React apps, and other types of apps.
Reframe is designed with "adaptability" in mind (= no lock-in).

This overview presents what Reframe is, how it's different from other web frameworks, and Reframe project's scope.

# Overview

Reframe allows you to define pages like this:

~~~js
!INLINE ../example/pages/HelloPage.universal.js
~~~

Running the `reframe` CLI serves the defined page:

~~~shell
$ reframe
✔ Page directory found at ~/code/reframe/example/pages
✔ Frontend built at ~/code/reframe/example/dist/browser/
✔ Server running at http://localhost:3000
~~~

The CLI command `reframe` searches for the `pages` directory, builds the frontend (webpack), and spins up a server (Node.js/hapi).

Once the frontend is built and the server up the source code of `http://localhost:3000/hello/alice` is;

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Hello alice</div></div>
        <script src="/commons.hash_e3c2135a3976b7ac378d.js" type="text/javascript"></script>
        <script src="/HelloPage.entry.hash_69c37a057d9dd0006c30.js" type="text/javascript"></script>
    </body>
</html>
~~~


#### Why Reframe?

Reframe is born out of the frustration of two conflicting intentions

 1. I want to use a framework to quickly implement a working prototype. And more importantly, I want to think about the application's architecture only later on and only if necessary rather than having to think through an entire app architecture before even starting writing one line of code.

 2. I don't want to use a framework because of the framework's limitations. And more importantly, I don't want to get locked-in to that framework down the road.

Is it possible to design a framework that allows both a quick start and full flexbility down the road?
The Reframe project is born out of the belief that it is.

With reframe, you can adapt the framework to your needs, instead of adapting your needs to the framework.

We call the notion of "full fexibility down the road" *adaptability* and such adaptable framework an (anti-)framework.

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


#### Adaptability

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
