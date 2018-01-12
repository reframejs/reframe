!MENU
!MENU_ORDER 20

This getting started explains how to create *page objects* for
HTML-static, HTML-dynamic, DOM-static, and DOM-dynamic pages.

# Usage Manual

Reframe revolves around *page objects* wich are JavaScript objects that define pages.

#### Contents

 - [Getting Started](#getting-started)
 - [HTML-static VS HTML-dynamic](#html-static-vs-html-dynamic)
 - [DOM-static VS DOM-dynamic](#dom-static-vs-dom-dynamic)
 - [Custom Browser JavaScript](#custom-browser-javascript)
 - [Partial DOM-dynamic](#partial-dom-dynamic)
 - [CSS](#css)
 - [Async Data](#async-data)
 - [Links & Page Navigation](#links-page-navigation)
 - [Production Environment](#production-environment)

#### Getting Started

Let's start by writing and running a hello world page.

We now create our pages directory

~~~shell
mkdir -p /tmp/reframe-playground/pages
~~~

and we create a new file `/tmp/reframe-playground/pages/HelloPage.html.js` with following content

~~~js
import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
        </div>
    ),
};
~~~

It is important to save the page with a filename ending with `.html.js`.
We will discuss later why.

We make use of the reframe CLI and we need React, so let's install these two

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd /tmp/reframe-playground/ && npm install react
~~~

By running

~~~shell
reframe /tmp/reframe-playground/pages
~~~

~~~shell
✔ Frontend built at /tmp/reframe-playground/dist/browser/
✔ Server running at http://localhost:3000
~~~

a server is spin up and our page is now available at http://localhost:3000.

An the HTML code view-source:http://localhost:3000/ is

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Hello World, from Reframe.</div></div>
    </body>
</html>
~~~

The page doesn't load any JavaScript and the DOM is static as there isn't any JavaScript to manipulate the DOM.
We say that the page is *DOM-static*.
You can also create pages with dynamic React components and we will see in a bit how.

Also note that our page is "HTML-dynamic" and we will now discuss what this means.


#### HTML-static vs HTML-dynamic

Let's consider the Hello World page of our previous section.
When is its HTML generated?
To get an answer we add a timestamp to our page and
modify `/tmp/reframe-playground/pages/HelloPage.html.js` to

~~~js
import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
            <br/>
            (Generated at {new Date().toLocaleTimeString()}.)
        </div>
    ),
};
~~~

If you haven't already, let's run a Reframe server

~~~shell
reframe /tmp/reframe-playground/pages
~~~

and the sell should print

~~~shell
$ reframe
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
~~~

If you haven't closed the server the CLI created in the previous section then 
Before we go on
If you were already running a Reframe, then Reframe automatically re-compiled the JavaScript and added a `✔ Re-build` notification in your shell

~~~shell
$ reframe
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
✔ Re-build
~~~

Let's use our timestamp to see when the HTML is created.

Reload the page and if the time is 13:37:00 then view-source:http://localhost:3000/hello is

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Hello from Reframe.<br/>(Generated at 13:37:00)</div></div>
    </body>
</html>
~~~

If we reload one second later at 13:37:01 we would get the same HTML except that
`(Generated at 13:37:00)` is now replaced with `(Generated at 13:37:01)`.
This means that everytime we load the page the HTML is re-rendered.
The HTML is generated at request-time and we say that this page is *HTML-dynamic*.

Now, the HTML of our hello world doesn't really need to be dynamic, so let's make it static.

For that we change our page object defined at `/tmp/reframe-playground/pages/HelloPage.html.js` to

~~~js
import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
            <br/>
            (Generated at {new Date().toLocaleTimeString()}.)
        </div>
    ),
	htmlIsStatic: true,
};
~~~

Setting `htmlIsStatic: true`
tells Reframe that the HTML is static and
Reframe creates the HTML at build-time.
You can actually see the static HTML on your filesystem at `/tmp/reframe-playground/dist/browser/index.html`.
If the time when building was `12:00:00` then our timestamp will always be `(Generated at 12:00:00)`, no matter when we load our page.

For pages with lot's of elements, generating the HTML at build-time instead of request-time is a considerable performance gain.
Also, if all yours pages are HTML-static, then you can deploy your app to any static website host such as GitHub Pages.

Before we move on to dynamic DOMs, let's look at another HTML-dynamic page

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Not only is this page HTML-dynamic but it actually has to.
That is because the route `/hello/{name}` of `HelloPage.html.js` is parameterized; There is an infinite number of pages with URLs matching the route such as `/hello/Alice-1`, `/hello/Alice-2`, `/hello/Alice-3`, etc. We can't compute an infinite number of pages at build-time and the page has to be HTML-dyanmic.

All pages that have a parameterized route are HTML-dynamic.

Let's now create pages that have dynamic views.



#### DOM-static VS DOM-dynamic

Let's consider the following page object that defines a page displaying the current time.

~~~js
!INLINE ../example/pages/TimePage.universal.js
~~~

~~~js
!INLINE ../example/views/TimeComponent.js
~~~

Looking at the HTML code view-source:http://localhost:3000/time

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Current Time</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Time: 13:38:00</div></div>
        <script type="text/javascript" src="/commons.hash_cef317062944dce98c01.js"></script>
        <script type="text/javascript" src="/TimePage.entry.hash_972c7f760528baca032a.js"></script>
    </body>
</html>
~~~

we see that in contrast to our previous DOM-static pages, this page loads JavaScript code.

The code
mounts a `<TimeComponent />` to the DOM element `#react-root` and
the mounted `<TimeComponent />` then updates the DOM every second to always show the current time.


We say that the page is *DOM-dynamic* as the DOM changes over time.

In case you are curious, the loaded JavaScript is
 - `/commons.hash_xxxxxxxxxxxxxxxxxxxx.js`,
   around 250KB in production,
   inlcudes React (~100KB),
   polyfills (~100KB),
   the router, and `@reframe/browser`.
   It is loaded by all pages and is indefinitely cached across all pages.
 - `/TimePage.entry.hash_xxxxxxxxxxxxxxxxxxxx.js`
   includes the compiled version of `TimePage.universal.js` and a tiny "entry wrapper".
   It is specific to the page and is typically lightweight.

Why does Reframe hydrate the view on the DOM whereas it previously didn't for our previous examples?
That's because our page object is saved as `TimePage.universal.js`, a filename name ending with `.universal.js`.
Our previous examples where saved as `*.html.js`.
A file saved as `pages/*.html.js` is treated as a page object defining a DOM-static page and
a file saved as `pages/*.universal.js` is treated as a page object defining a DOM-dynamic page.
Reframe also picks up `pages/*.entry.js` and `pages/*.dom.js` files and we talk about these files in the next two sections.


Imagine a page where 90% of your page's view is DOM-static and only certain parts of the page needs to be made DOM-dynamic.
It would be wasteful to load the view's entire code and to hydrate the whole page in the browser.
Instead we can tell Reframe to hydrate only one or several parts of the page.
We call this technique `partial DOM-dynamic`.


#### partial DOM-dynamic

Instead of hydrating the whole page you can hydrate only some parts of the page.
This effectively makes these parts DOM-dynamic while the rest of the page stays DOM-static.
Hence the term "partial DOM-dynamic".

This can be a significant performance improvement
when large portions of your page don't need to be DOM-dynamic.

It also introduces a clean separation between DOM-static components and DOM-dynamic components,
making reasoning about your page easier.

To achieve that, instead of defining one page object as `MyDynamicPage.universal.js` we define two page objects, one as `MyDynamicPage.html.js` meant for server-side rendering and another `MyDynamicPage.dom.js` meant for browser-side rendering.

~~~js
!INLINE ../example/pages/NewsPage.html.js
~~~

~~~js
!INLINE ../example/pages/NewsPage.dom.js
~~~

When defining a page as a `.html.js` file and a `.dom.js` file, not only do we hydrate the DOM-dynamic parts only but we also only load the code for the DOM-dynamic parts. That is because only the `.dom.js` page object is loaded in the browser and the `.html.js` page object is never used in the browser. That way in our NewsPage we can see that the `.dom.js` page object only loads `` and not the (imaginary) KB heavy code ``.

Beyond , you can gain finer control over what's happening in the browser by writing the browser entry code yourself.

#### Custom Browser JavaScript

<script async src='https://www.google-analytics.com/analytics.js'></script>

~~~js
!INLINE ../example/pages/TrackingPage.html.js
~~~

~~~js
!INLINE ../example/pages/TrackingPage.entry.js
~~~

We refer to our Customization Manual
for more information about writing a custom browser entry point.


#### CSS

~~~js
!INLINE ../example/pages/GlitterPage.universal.js
~~~

~~~js
!INLINE ../example/views/GlitterComponent.js
~~~

~~~css
!INLINE ../example/views/GlitterStyle.css
~~~

Note how we load images

Custom webpack configuration.
See Customization Manual.

#### Async Data

~~~js
!INLINE ../example/pages/GameOfThronesPage.html.js
~~~

~~~js
!INLINE ../example/views/GameOfThronesComponent.js
~~~

#### Links


#### Custom Server

We refer to our Customization Manual
for further information about using Reframe
as a hapi plugin
and/or writing a custom server


#### Production Environment

By default, Reframe compiles for development.

By setting `process.env.NODE_ENV = 'production';` in Node.js or `export NODE_ENV='production'` on your Unix(-like) OS
you tell Reframe to compile for production.

When compiling for production,
the auto-reload feature is disabled,
the code is transpiled to support all browsers (instead of only the last 2 versions of Chrome and Firefox when compiling for dev),
the code is minifed,
the low-KB production build of React is used,
etc.


### Related Docs Reference



