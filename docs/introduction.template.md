[<p align="center"><img src='https://github.com/brillout-test/reprop-test/blob/master/docs/logo/logo-title.svg' width=400 style=    "max-width:100%;" alt="Reprop"/></p>](https://github.com/brillout/reprop)
<br/>

!MENU
!OUTPUT ../readme.md
!MENU_TITLE Introduction
!MENU_ORDER 10
!MENU_LINK /../../

Reframe is a library to render React views on the server, and/or in the browser, and/or statically.
Easily create static and universal React apps.
Designed with adaptability in mind.


Reframe allows you to define pages like this:

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Running `reframe` serves the defined pages:

~~~shell
$ reframe
✔ Page directory found at /home/brillout/code/@reframe/example/pages
✔ Frontend built at /home/brillout/code/@reframe/example/dist/
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
        <div id="repage-renderer-react_container"><div>Hello World</div></div>
    </body>
</html>
~~~

This page is static but you can also create dynamic pages.

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

Amongst others you can create universal apps (isomorphic apps), i.e. apps that are rendered on both the server and the browser.
You can as well create static apps, i.e. apps where all pages are HTML-static.
And you can create any combination of HTML-(static/dynamic) and DOM-(static/dynamic) pages.


Reframe takes care of;

 - **Routing**.
   <br/>
   I.e. the mapping of a URL to a React component. (Reframe's default routing library is [Crossroads.js](https://github.com/millermedeiros/crossroads.js) but you can also choose another routing library and create your own route rules.)
 - **Server**.
   <br/>
   Reframe sets up a Node.js/hapi server to render your react pages to HTML. (But you can also use Reframe with your own server.)
 - **Build**.
   <br/>
   Reframe builds and bundles your frontend assets for you. (Reframe uses webpack. You can use a fully custom webpack configuration.)


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
   You can use Reframe as a hapi plugin so that you can create the hapi server yourself. Which is useful if for example you want to add GraphQL / RESTful API endpoints to the server.
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
