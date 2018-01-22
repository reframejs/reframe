Reframe, the web (anti-)framework &mdash; quickly implement an app, without lock-in.

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

Reframe renders your React components on the server, and/or in the browser, and/or statically.
It helps you create static websites, universal React apps, SPAs, and other types of apps.
Reframe is designed so that it doesn't lock you in.

# Overview

##### Contents

 - [What is Reframe?](#what-is-reframe)
 - [Why Reframe?](#why-reframe)
 - [Rreframe Project Scope](#reframe-project-scope)


### What is Reframe?

Reframe allows you to define pages like this:

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Running the `reframe` CLI then serves the page, as defined by the `HelloPage` object.

~~~shell
$ reframe
✔ Page directory found at ./example/pages
✔ Frontend built at ./example/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

The CLI searches for the `pages/` directory, builds the frontend (webpack), and spins up a server (Node.js/hapi).

The source code of `http://localhost:3000/hello/Alice` is then:

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

All kinds of apps can be created (static websites, universal React apps, SPAs, etc.),
and Reframe is customizable
(custom webpack config, custom build tool such as Rollup, custom hapi server config, custom server framework such as Express, custom routing library other than Crossroads.js, custom React integration, custom view library such as Preact, etc.).


### Why Reframe?

Reframe is born out of two opposed intentions:

 - I want to use a framework to quickly implement a prototype.
   And I don't want to design an entire app architecture before even starting to write one line of code.

 - I don't want to use a framework because of the framework's limitations.
   And more importantly, I don't want to get locked into that framework down the road.

Upon this conflict, the question arises

 > Is it possible to design a framework that allows its user to quickly implement a prototype without locking the user in?

Reframe is born out of the belief that it is.

Reframe is designed so that parts of it can be overwritten.
This means that, if something doesn't suit a need, you can replace Reframe parts with code of your own to suit your need.
You can progressively and over time re-write all Reframe parts and get rid of Reframe altogether.
In short, Reframe is fully customizable.

We call the characteristic of being able to adapt to yours needs *adaptability*,
and we call such adaptable framework an *(anti-)framework*.



### Reframe Project Scope

With Reframe you can create pages that are:

 - **HTML-static**
   <br/>
   The page's HTML is rendered when building the frontend.
   <br/>
   (The HTML doesn't change; the HTML is rendered at "build-time".)
 - **HTML-dynamic**
   <br/>
   The page's HTML is rendered upon each HTTP request.
   <br/>
   (The HTML can vary from request to request; the HTML is rendered at "request-time".)
 - **DOM-static**
   <br/>
   The page's DOM is not manipulated, and React is only used to render HTML.
   <br/>
   (Reframe uses `require('react-dom/server')` and not `require('react-dom')`; React doesn't manipulate the DOM.)
 - **DOM-dynamic**
   <br/>
   The page has React components that dynamically change in the browser.
   <br/>
   (Reframe uses `require('react-dom')`; React manipulates the DOM.)

This allows you to create
universal React apps,
static websites,
SPAs, and any combination of HTML-static/HTML-dynamic and DOM-static/DOM-dynamic pages.

Reframe does:

 - **Build**
   <br/>
   Builds and bundles your frontend assets. (By using webpack.)
 - **Server**
   <br/>
   Sets up a Node.js/hapi server serving dynamic HTMLs and static browser assets.
 - **Routing**
   <br/>
   Maps URLs to pages.

Reframe **doesn't** take care of:

 - View logic / state management.
   <br/>
   It's up to you to manage the state of your views. (Or use Redux / MobX / [Reprop](https://github.com/brillout/reprop).)
 - Database.
   <br/>
   It's up to you to create, populate, and query databases.
