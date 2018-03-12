A JavaScript library to manage pages.
Render pages on the server, and/or in the browser, and/or statically.
Low-level, unopinionated, plugin-based and "adaptable".

!MENU
!MENU_LINK /../../
!OUTPUT ../readme.md

# Overview

Repage is **a low-level tool meant to be used by library authors**.
If your intention is to create a web app,
you are most likely better off,
if you **use a higher-level tool such as [Reframe](https://github.com/brillout/reframe) instead**.
(Reframe is built on top of Repage.)

If your intention is to create a framework to create web apps, where the app's pages are rendered on the server, and/or in the browser, and/or statically, then you are at the right address.

Upon defining pages with *page objects* Repage provides three functions:
`getPageHtml` to get the HTML of the page that matches a given URI (for server-side rendering),
`getStaticPages` to get the HTML of all static pages (for static rendering),
and `hydratePage` to hydrate the DOM of the current page (for browser-side rendering).

With the right plugins, Repage can take care of the following;
 - Routing
 - Server-side rendering
   <br/>
   (Rendering views to HTML upon HTTP requests.)
 - Browser-side rendering
   <br/>
   (Rendering views by manipulating the DOM.)
 - Static rendering
   <br/>
   (Rendering views to HTML on build-time.)

Repage doesn't take care of anything else.
In particular Repage doesn't take care of building/bundling browser code.

Repage is *adaptable*.
With adaptable we denote Repage's ability to adapt to your needs.
Repage's adaptability is based on
having plugins that are interchangeable,
and on the fact that
Repage's source code has been design so that you can replace parts of Repage with code of your own.


This repository holds several NPM packages;

Core packages;
 - `@repage/build`
    <br/>
    Provides `getStaticPages()` which returns the HTML and URL of all pages that have static HTML. (We call these pages *HTML-static*. And we call *HTML-dynamic* pages that are not HTML-static.)
 - `@repage/server`
    <br/>
    Provides `getPageHtml()` which, for a given URI, returns the HTML of the page that matches the given URI.
 - `@repage/browser`
    <br/>
    Provides `hydratePage()` which hydrates the page (i.e. adds DOM event listeners). Meant for pages that manipulate the DOM. (We call these pages *DOM-dynamic*. And we call *DOM-static* pages are not *DOM-dynamic*.)
 - `@repage/core`
    <br/>
    Provides `Repage()` which constructs a *repage object*. The repage object handles page objects and plugins.

The packages `@repage/build`, `@repage/server`, `@repage/browser` can be replaced with arbitrary code.
And `@repage/core` can be replaced with any code
as long as it implements a constructor that
instantiates a repage object that keeps the same interface.
Check out the source code of the package you want to replace. All packages are lightweight (<200 LOC).

Plugin packages;
 - `@repage/renderer-react`
    <br/>
    Renders pages with [React](https://github.com/facebook/react).
 - `@repage/router-crossroads`
    <br/>
    Handles routing with [Crossroads.js](https://github.com/millermedeiros/crossroads.js).

Plugins are interchangeable.
If you want to use a router other than Crossroads.js, then you can create a new plugin.
And if you want to use a view library other than React, then you can create a new plugin as well.
Check out the source code of the plugin you want to replace. All plugins are lightweight (<200 LOC).

See the usage section for usage information.
