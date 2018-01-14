!MENU
!MENU_ORDER 20

This usage manual acts as reference for using Reframe's default setup.
It should cover most common use cases.
(Create a GitHub issue if a common use case is missing.)

As your app grows you will likely hit an edge case not covered by the default setup.
In that situation we refer to the Customization Manual.
With some willingness of diving into Reframe and re-writing parts, all edge cases should be achievable.
(Feel free to create a GitHub issue to get support.)

# Usage Manual

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
 - [Related External Docs](#related-external-docs)

#### Getting Started

Let's start by writing a Hello World page.

We first create a `pages/` directory

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~

we then create a new file `~/tmp/reframe-playground/pages/HelloPage.html.js` with the following content

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

We call the exported JavaScript object a *page object*.
Every page is defined by such page object.

Note that it is important to save the page object as a filename that ends with `.html.js`.
We will discuss later why.

Let's now run our Hello World page.
For that we will use the reframe CLI and we need React, so let's install these two

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd ~/tmp/reframe-playground/ && npm install react
~~~

Running

~~~shell
reframe ~/tmp/reframe-playground/pages
~~~

prints

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

and spins up a server making our page available at http://localhost:3000.

Note that the CLI is optional but is convenient to quickly get started.

The HTML view-source:http://localhost:3000/ is

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

As we can see, the page doesn't load any JavaScript.
The DOM is static as there isn't any JavaScript to manipulate the DOM.
We say that the page is *DOM-static*.
We can also create pages with dynamic views, i.e. with a dynamic DOM, and we will see later how.

Our page is what we call "HTML-dynamic" and we will now discuss what this means.


#### HTML-static vs HTML-dynamic

Let's consider the Hello World page of our previous section.
When is its HTML generated?
To get an answer we modify our page to display a timestamp.
We alter its page object from our previous section at `~/tmp/reframe-playground/pages/HelloPage.html.js` to

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
npm install -g @reframe/cli
reframe ~/tmp/reframe-playground/pages
~~~

and the sell should print

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

If you haven't closed the server from the previous section then
Reframe has automatically re-compiled the frontend and added a `✔ Re-build` notification to your shell

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
✔ Re-build
~~~

We now reload the page and, assuming the time is 13:37:00, we see that the HTML view-source:http://localhost:3000/hello is

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

And if we reload one second later at 13:37:01, we get the same HTML except that
`(Generated at 13:37:00)` is now replaced with `(Generated at 13:37:01)`.
This means that everytime we load the page the HTML is re-rendered.
We say that the HTML is generated at *request-time* and that the page is *HTML-dynamic*.

Now, the HTML of our Hello World page doesn't really need to be dynamic.
Let's make it static.

For that we change our page object `~/tmp/reframe-playground/pages/HelloPage.html.js` to

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

When `htmlIsStatic: true` is set
Reframe renders the HTML only once when building the frontend.

If the time when building the frontend was `12:00:00` then our page will always show `(Generated at 12:00:00)`, no matter when we load the page.

You can actually see the generated HTML at `~/tmp/reframe-playground/dist/browser/index.html`.

We say that the HTML is generated at *build-time* and that the page is *HTML-static*.

To sum up,
`htmlIsStatic: false` makes Reframe render the HTML at request-time and
`htmlIsStatic: true` makes Reframe render the HTML at build-time.

For pages with lot's of elements, generating the HTML at build-time instead of request-time can be a considerable performance gain.
Also, if all your pages are HTML-static, you can then deploy your app to a static website host such as GitHub Pages.

We can as well create pages with a dynamic DOM.
But before we move on to the DOM let's look at a special case of an HTML-dynamic page

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Not only is this page HTML-dynamic but it actually has to.
That is because its route `/hello/{name}` is parameterized;
There is an infinite number of pages with URLs matching the route such as `/hello/Alice-1`, `/hello/Alice-2`, `/hello/Alice-3`, etc.
We can't compute an infinite number of pages at build-time; The page has to be HTML-dyanmic.

All pages with a parameterized route are HTML-dynamic.

Let's now move on and create pages with dynamic views.



#### DOM-static VS DOM-dynamic

Let's consider the following page object that defines a page that displays the current time.

~~~js
!INLINE ../example/pages/TimePage.universal.js
~~~

~~~js
!INLINE ../example/views/TimeComponent.js
~~~

Looking at the HTML view-source:http://localhost:3000/time

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

The JavaScript code
mounts a `<TimeComponent />` to the DOM element `#react-root` and
the mounted `<TimeComponent />` then updates the DOM every second to always show the current time.

The DOM changes over time and we say that the page is *DOM-dynamic*.

But why does Reframe hydrates the DOM whereas it previously didn't for our previous examples?
The reason is that our page object is saved as `TimePage.universal.js`,
a filename name ending with `.universal.js`,
whereas our previous examples where saved as `*.html.js` files.

A page with a page object saved as `pages/*.html.js` is treated as DOM-static and
a page with a page object saved as `pages/*.universal.js` is treated as DOM-dynamic.
Reframe also picks up `pages/*.entry.js` and `pages/*.dom.js` files and we talk about these in the next two sections.

In case you are curious, the loaded JavaScript
 - `/commons.hash_xxxxxxxxxxxxxxxxxxxx.js`
   is around 250KB in production,
   inlcudes React (~100KB),
   polyfills (~100KB),
   the router, and `@reframe/browser`.
   It is loaded by all pages and is indefinitely cached across all pages.
 - `/TimePage.entry.hash_xxxxxxxxxxxxxxxxxxxx.js`
   includes the compiled version of `TimePage.universal.js` and a tiny wrapper.
   It is specific to the page and is typically lightweight.

Hydrating the entire view of the page is not always what we want.

Imagine a page where a vast majority of the page is DOM-static and
only some parts of the page need to be made DOM-dynamic.
It that case,
it would be wasteful to load the view's entire code in the browser and
to hydrate the whole page.
Instead we can tell Reframe to hydrate only parts of the page.
We call this technique *partial DOM-dynamic*.



#### Partial DOM-dynamic

Instead of hydrating the whole page we can tell Reframe to hydrate only some parts of the page.
This means that while these parts are DOM-dynamic, the rest of the page stays DOM-static.
(Hence the term "partial DOM-dynamic".)

This can be a significant performance improvement
when large portions of the page doesn't need to be DOM-dynamic.

It also introduces a clean separation between DOM-static components and DOM-dynamic components,
making reasoning about your page easier.

To achieve such partial hydration,
instead of defining a page with one page object `MyDynamicPage.universal.js`,
we define the page with two page objects.
One as `MyDynamicPage.html.js` meant for server-side rendering and
another `MyDynamicPage.dom.js` meant for browser-side rendering.
Like in the following.

~~~js
!INLINE ../example/pages/NewsPage.html.js
~~~

~~~js
!INLINE ../example/pages/NewsPage.dom.js
~~~

When we define a page with two separate page objects like this,
not only do we hydrate only what's necessary but we also load only code that's necessary.
Because, only the `.dom.js` page object is loaded in the browser and
the `.html.js` page object is loaded in the browser.

For example, in our NewsPage we can see that the `NewsPage.dom.js` file only loads `` and not the (imaginary) KB heavy ``.

Beyond being able to define partial hydration,
you can gain further control over what's happening in the browser
by writing the browser entry code yourself
(instead of using the browser entry code generated by Reframe.).

#### Custom Browser JavaScript

If your page is saved as `pages/MyPage.html.js` and if you save JavaScript code as `pages/MyPage.entry.js` then Reframe will take this JavaScript code as browser entry point.

For further information about the custom browser entry point `pages/*.entry.js`
we refer to our Customization Manual.

You can as well add arbitrary script tags to the page's HTML (async scripts, external scripts, etc.).
We refer to documentation of `@brillout/html-head` for further information, see the "Related External Docs" Section at the bottom of this page.

#### CSS & Static Assets


The following page shows how CSS, fonts, and images are used with Reframe's default setup (i.e. Reframe's default webpack configuration).

~~~js
!INLINE ../example/pages/GlitterPage.universal.js
~~~

~~~js
!INLINE ../example/views/GlitterComponent.js
~~~

~~~css
!INLINE ../example/views/GlitterStyle.css
~~~

The CSS file is loaded by simply importing it and the font is as well loaded by simply importing it.

The images are used by using the fact that importing a static asset returns the URL of that static asset.

That way we can import an image in JavaScript, get its URL and use the URL in the CSS, e.g. `background-image: url('./diamond.png');`, or use the URL to set a `<img>`'s src attribute, e.g. `<img className='diamond' src={diamondUrl}/>`.

Note how we load images

All assests are file-loader static assets 

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

The Reframe CLI displays `[PROD]` when compiling for production.

~~~shell
$ reframe
✔ Page directory found at ~/tmp/reframe/example/pages/
✔ Frontend built at ~/tmp/reframe/example/dist/browser/ [PROD]
✔ Server running at http://localhost:3000
~~~

### Related External Docs

 - Repage - Low-level and unopinionted page management library that Reframe is build on top of
 - @brillout/html-head - Package that Reframe uses to generated the HTML head
 - @brillout/find - Package that the Reframe CLI uses to search for the `pages/` directory

