!INLINE ./logo.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

# Overview

##### Contents

 - [What is Reframe?](#what-is-reframe)
 - [Why Reframe?](#why-reframe)
 - [Rreframe Project Scope](#reframe-project-scope)


### What is Reframe?

Reframe allows you to create apps by defining React components
and Reframe takes care of the rest
(transpilation, bundling, and server creation).
That way, you can easily create uniserval apps, static apps, and other types of apps.

Reframe renders your React components on the server, and/or in the browser, and/or statically.
It helps you create static websites, universal React apps, SPAs, and other types of apps.
Reframe is designed so that it doesn't lock you in.

 - Universal React apps (React components are rendered to HTML and rendrerd to the DOM in the browser.)
 - Static apps (
 - JavaScript-less apps (React components are rendered to HTML only and no JavaScript is loaded.)
 - And many more types of apps.



With Reframe, you to define pages like this:

~~~js
!INLINE ../example/pages/HelloPage.html.js --hide-source-path
~~~

And the `reframe` CLI takes care of the rest.



All kinds of apps can be created:
static websites,
universal React apps,
SPAs,
etc.

And Reframe is customizable:
custom webpack config,
custom build tool such as Rollup,
custom hapi server config,
custom server framework such as Express,
custom routing library other than Crossroads.js,
custom React integration,
custom view library such as Preact,
etc.


### Why Reframe?

##### Easy

The examle about already already covers represents 50% of Reframe's basic usage.

Beyond that 


Reframe is born out of two conflicting intentions:

 - I want to use a framework to quickly implement a prototype.
   I don't want to design an entire app architecture before even starting to write one line of code.

 - I don't want to use a framework because of the framework's limitations.
   And more importantly, I don't want to get locked into that framework down the road.

Upon this conflict, the question arises:

 > Is it possible to design a framework that allows its user to quickly implement a prototype without locking the user in?

Reframe is born out of the belief that it is.

Reframe is designed so that its parts can be overwritten.
This means that, if Reframe doesn't suit a need, you can replace Reframe parts with code of your own to adapt Reframe to your need.
You can progressively and over time re-write all Reframe parts and get rid of Reframe altogether.

We call the characteristic of being able to adapt to your needs *adaptability*,
and we call such adaptable framework an *(anti-)framework*.


# Features

 - Fully
 - Performant
  - Code splitting
  - HTML-static pages
  - DOM-static pages
  - Optimal HTTP Caching


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
SPAs, and any combination of HTML-static / HTML-dynamic / DOM-static / DOM-dynamic pages.

Reframe does:

 - **Build**
   <br/>
   Builds and bundles your frontend assets. (Uses webpack.)
 - **Server**
   <br/>
   Sets up a Node.js/hapi server, serving dynamic HTMLs and static browser assets.
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


<br/>

### Reframe VS Next.js

Reframe wouldn't exist if Next.js nailed down the React framework problem, but they didn't.

Next.js' solution 

 - Ease of use
   - Routing is a hassle. (Parameterized routes are a big hassle, routes for static html don't work in dev mode.)
   - Server customization is a hassle (and implement caching yourself)
 - Customization
  - Next.js's has no plugin system.
  - Next.js's build step is not customizable [1]
    - No Typescript support. (Typescript is broken.)
    - No PostCSS support. (It's not entirely impossible to use PostCSS but the steps to do so are prohibitively complicated.)
    - In general, custom webpack loaders are not supported.
  - Can't customize browser JavaScript
   - Analytics.js
  - Next.js bundles [styled-jsx](https://github.com/zeit/styled-jsx) which you cannot opt-out. Yet, there are superior alternatives to styled-jsx, such as [Glamourous](https://github.com/paypal/glamorous).
  - No support for custom view libraries such as Preact
 - Performance
   - Can't get rid of Client-Side React. (That's [how Netflix achieves high performance on their landing page](https://twitter.com/netflixuie/status/923374215041912833?lang=en).)
   - The entire page's view is hydrated/re-rendered in the browser
     whereas with Reframe allows you to hydrate/re-render only parts of your page's view.
   - Static assets are not indefinitely cached
     (In contrast Reframe sets the `Cache-Control` header with `immutable` and `max-age`'s maxium value.)

[1] Technically speaking, Next.js' webpack configuration can be modified, but Next.js' has many restrictions on the configuration making it very hard to customize. In practice, Next.js' build step is not customizable.


### Getting Started

To get started, read the "Getting Started" section of the [Usage Manual](/docs/usage-manual.md).
