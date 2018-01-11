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
 - [Partial DOM-dynamic](#html-dynamic-partial-dom-dynamic)
 - [CSS](#css)
 - [Async Data](#async-data)
 - [Links & Page Navigation](#links)
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



We will use the reframe CLI and we need React, so let's install these two

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd /tmp/reframe-playground/ && npm install react
~~~

By running

~~~shell
$ reframe /tmp/reframe-playground/pages
✔ Frontend built at /tmp/reframe-playground/dist/browser/
✔ Server running at http://localhost:3000
~~~

a server is spin up and our page is now available at http://localhost:3000.

Looking at its source code at view-source:http://localhost:3000/

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

We see that the page doesn't load any JavaScript, thus the DOM is static.
We say that the page is *DOM-static*.

Also, our page is "HTML-dynamic" and we will now see what this means.


#### HTML-static vs HTML-dynamic

When is our hello world page we created in the previous section generated?
To get an answer let's add a timestamp to our page and
we modify `/tmp/reframe-playground/pages/HelloPage.html.js` to

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

Note that Reframe automatically re-compiles the JavaScript and the shell prints

~~~js
✔ Re-build
~~~

Now reload the page and if the time is 13:37:00 then view-source:http://localhost:3000/hello is

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
The HTML is dynamic and we call this page *HTML-dynamic*.

Our hello world doesn't the HTML to be dynamic, so let's make it static.

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

Beyond increased performance, an advantage of HTML-static pages is that they don't require a server and
Also, and if all yours pages are HTML-static, then you can deploy your app to any static website host such as GitHub Pages.


A hello world page definition:

~~~js
!INLINE ../example/pages/HelloWorldPage.html.js
~~~

Upon running the `reframe` CLI a Node.js/hapi server serving our page is created:

~~~shell
$ npm install -g @reframe/cli
~~~

~~~shell
$ reframe
✔ Page directory found at /home/alice/code/my-project/reframe-example/pages
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
~~~

As shown at view-source:http://localhost:3000/hello the HTML of our page is:

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

Because of `htmlIsStatic: true` Reframe generates the HTML on build-time and the page's HTML is static.
We don't load any JavaScript and the DOM is static as well.


Let's consider a more dynamic example.

#### HTML-dynamic & DOM-static

We implement a page that displays the current date without time.
We also display a timestamp to see when the page has been generated.

~~~js
!INLINE ../example/pages/DatePage.html.js
~~~

If the current time would be 1/1/2018 1:37 PM then the HTML code would be

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Current Date</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root">
            <div>Date: Mon Jan 01 2018</div>
            <small>(Generated at 13:37:00)</small>
        </div>
    </body>
</html>
~~~

Reloading the page 1 second later at 1:38 PM would lead to the same HTML but with `(Generated at 13:38:00)` instead of `(Generated at 13:37:00)`;
This means that the HTML is re-rendered on every request and the page's HTML is dynamic.

We still don't load any JavaScript, the page's DOM is static. We call this page a HTML-dynamic DOM-static page.

Another example of a HTML-dynamic DOM-static page is the `HelloPage.html.js` of the overview.

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Note that the route `/hello/{name}` of `HelloPage.html.js` is parameterized and it because of that it can't be HTML-static; There is an infinite number of pages with URLs `/hello/Alice-1`, `/hello/Alice-2`, `/hello/Alice-3`, etc. and we can't compute them all at build-time and the page has to be HTML-dyanmic.
In general, all pages that have a parameterized route are HTML-dynamic.


Let's now look at a DOM-dynamic page.

#### HTML-dynamic & DOM-dynamic

We create a page that loads JavaScript code that updates the time every second by manipulating the DOM with React.

Note that we save our page object file as `TimePage.universal.js`.
The filename ends with `.universal.js`
whereas all previous filenames end with `.html.js`.
(`HelloPage.html.js`, `DatePage.html.js`, and `TimePage.html.js`.)

By saving a page object with a `universal.js` suffix we tell Reframe that the view is to be rendered on the browser as well.
(Reframe will then call `ReactDOM.hydrate()`.)

~~~js
!INLINE ../example/pages/TimePage.universal.js
~~~

And the HTML code of view-source:http://localhost:3000/hello is:

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

As the HTML code shows JavaScript code is loaded.
When this JavaScript code runs, a `<TimeComponent/>` element is mounted onto the DOM.
The mounted `<TimeComponent/>` then updates the DOM every second and the current time is continuously updated.

When Reframe sees a `.universal.js` file in the `pages` directory it will generate JavaScript code that acts as entry point for the browser.
You can see generated entry point source code at `~/code/@reframe/example/pages/dist/browser/source/TimePage.entry.js`.

The entry point generated by Reframe includes the whole .universal.js and the whole view is loaded to the browser.
This is fine if you the view of the whole page isn't too KB heavy or if the whole page needs to by hydrated anyways.
But you can also choose to hydrate only a small part of your page so that you don't have to load the entire page view logic onto the browser. We call this "partial DOM-dynamic" and we'll see how to that in a bit. Before that let's see how to create the browser entry point yourself.

You can also create the JavaScript browser entry point yourself.

#### Custom Browser Entry Point + External Scripts

<script async src='https://www.google-analytics.com/analytics.js'></script>

~~~js
!INLINE ../example/pages/TrackingPage.html.js
~~~

~~~js
!INLINE ../example/pages/TrackingPage.entry.js
~~~


#### HTML-dynamic & partial DOM-dynamic

~~~js
!INLINE ../example/pages/NewsPage.html.js
~~~

~~~js
!INLINE ../example/pages/NewsPage.dom.js
~~~

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

#### Async Data

~~~js
!INLINE ../example/pages/GameOfThronesPage.html.js
~~~

~~~js
!INLINE ../example/views/GameOfThronesComponent.js
~~~

#### Links



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



