Reframe, the web (anti-)framework &mdash; quickly implement an app, without lock-in.

!MENU
!MENU_ORDER 20

The usage manual acts as reference for using Reframe's default setup.
The default setup should cover most common use cases.
(Create a GitHub issue if a common use case is missing.)

As your app grows, you will likely hit edge cases not covered by the default setup.
In these situations, we refer to the Customization Manual.
With willingness to dive into Reframe and to re-write parts, pretty much all edge cases should be achievable.

# Usage Manual

##### Contents

 - [Getting Started](#getting-started)
 - [HTML-static VS HTML-dynamic](#html-static-vs-html-dynamic)
 - [DOM-static VS DOM-dynamic](#dom-static-vs-dom-dynamic)
 - [Partial DOM-dynamic](#partial-dom-dynamic)
 - [Custom Browser JavaScript](#custom-browser-javascript)
 - [CSS & Static Assets](#css--static-assets)
 - [Async Data](#async-data)
 - [Links & Page Navigation](#links--page-navigation)
 - [Custom Server](#custom-server)
 - [Custom Head](#custom-head)
 - [404 Page](#404-page)
 - [Production Environment](#production-environment)
 - [Related External Docs](#related-external-docs)



## Getting Started

Let's start by writing a Hello World page.

We first create a `pages/` directory

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~

we then create a new file `~/tmp/reframe-playground/pages/HelloPage.html.js` with following content

~~~js
import React from 'react';

const HelloWorldPage = {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
        </div>
    ),
};
export default HelloWorldPage;
~~~

We call `HelloWorldPage` a *page object*.
Every page is defined by such page object.

Note that it is important to save the page object with a filename that ends with `.html.js`.
We will discuss later why.

Let's now run our Hello World page.
For that, we use the reframe CLI, and we need React.
Let's install these two.

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd ~/tmp/reframe-playground/ && npm install react
~~~

We run the CLI

~~~shell
reframe ~/tmp/reframe-playground/pages
~~~

which prints

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

and spins up a server making our page available at http://localhost:3000.

The HTML `view-source:http://localhost:3000/` is

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
And the DOM is static, as there isn't any JavaScript to manipulate the DOM.
We say that the page is *DOM-static*.

We can also create pages with a dynamic view and a dynamic DOM.
We will see later how.

Our page is what we call "HTML-dynamic", and we now discuss what this means.



## HTML-static vs HTML-dynamic

Let's consider the Hello World page of our previous section.
When is its HTML generated?
To get an answer we modify the page to display a timestamp.
We alter the page object from our previous section at `~/tmp/reframe-playground/pages/HelloPage.html.js` to

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

If you haven't already, let's start a server

~~~shell
npm install -g @reframe/cli
reframe ~/tmp/reframe-playground/pages
~~~

and the shell prints

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

If you haven't closed the server from the previous section, then
Reframe automatically re-compiled the frontend and prints a `✔ Re-build` notification to your shell.

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
✔ Re-build
~~~

We now reload the page and &mdash; assuming the time is 13:37:00 &mdash; the HTML `view-source:http://localhost:3000/hello` is

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

If we reload one second later &mdash; at 13:37:01 &mdash; we get the same HTML except that
`(Generated at 13:37:00)` is now replaced with `(Generated at 13:37:01)`.
This means that the HTML is (re-)rendered every time we load the page.
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

When we declare the page's HTML to be static
(with `htmlIsStatic: true`)
Reframe renders the HTML only once when building the frontend.

If the time when building the frontend was 12:00:00,
then our page will always show `(Generated at 12:00:00)`, no matter when we load the page.

We say that the HTML is generated at *build-time* and that the page is *HTML-static*.

We can actually see the, at build-time generated, HTML at `~/tmp/reframe-playground/dist/browser/index.html`.

To sum up,
`htmlIsStatic: false` declares the page as HTML-dynamic and the HTML is rendered at request-time,
and
`htmlIsStatic: true` declares the page as HTML-static and the HTML is rendered at build-time.

For pages with lot's of elements, generating the HTML at build-time instead of request-time can be a considerable performance gain.

Also,
if all our pages are HTML-static,
then all HTMLs are rendered at build-time,
no server code is required,
and we can deploy our static app to a static website host
such as [GitHub Pages](https://pages.github.com/).

Not only do we have control over whether the HTML is static or not,
but we also have control over whether the DOM is static or not.
Before we move on to the DOM, let's look at a special case of an HTML-dynamic page.

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Not only is this page HTML-dynamic but it actually has to.
That is because its route, `/hello/{name}`, is parameterized.
There are an infinite number of pages with URLs matching the route, such as `/hello/Alice-1`, `/hello/Alice-2`, `/hello/Alice-3`, etc.
We can't compute an infinite number of pages at build-time; the page has to be HTML-dyanmic.

All pages with a parameterized route are HTML-dynamic.

As HTML-static pages are more performant, we recommand to make a page HTML-dynamic only if necessary.

Let's now create pages with dynamic views.



## DOM-static VS DOM-dynamic

We consider the following page object that defines a page displaying the current time.

~~~js
!INLINE ../example/pages/TimePage.universal.js
~~~

~~~js
!INLINE ../example/views/TimeComponent.js
~~~

Looking at the HTML `view-source:http://localhost:3000/time`

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

we see that, in contrast to our previous DOM-static pages, the page loads JavaScript code.

The JavaScript code
mounts a `<TimeComponent />` to the DOM element `#react-root`, and
the mounted `<TimeComponent />` then updates the DOM every second to always show the current time.

The DOM changes over time and we say that the page is *DOM-dynamic*.

But why does Reframe hydrate the DOM whereas it previously didn't at our previous examples?
It's because our page object is saved as `TimePage.universal.js`,
a filename name ending with `.universal.js`,
whereas our previous examples were saved as `*.html.js` files.

So,
a page with a page object saved as `pages/*.html.js` is treated as DOM-static and
a page with a page object saved as `pages/*.universal.js` is treated as DOM-dynamic.
Reframe also picks up `pages/*.entry.js` and `pages/*.dom.js` files and we talk about these in the next two sections.

In case you are curious, the loaded JavaScript is:
 - `/commons.hash_xxxxxxxxxxxxxxxxxxxx.js`
   which
   is around 250KB in production,
   inlcudes React (~100KB),
   polyfills (~100KB),
   the router, and the `@reframe/browser` package.
   It is loaded by all pages and is indefinitely cached across all pages.
 - `/TimePage.entry.hash_xxxxxxxxxxxxxxxxxxxx.js`
   which
   includes the compiled version of `TimePage.universal.js` and a tiny wrapper.
   It is specific to the page and is usually lightweight.

As DOM-static pages are more performant, we recommand to make a page DOM-dynamic only if necessary.

So, when defining the page with a `.universal.js` file, the entire page is hydrated.
But this is not always what we want.
Imagine a page where a vast majority of the page is DOM-static and
only some parts of the page need to be made DOM-dynamic.
It that case,
it would be wasteful to load the view's entire code in the browser and
to hydrate the whole page.
Instead, we can tell Reframe to hydrate parts of the page only.
We call this technique *partial DOM-dynamic*.



## Partial DOM-dynamic

Besides being able to hydrate the entire page with a `.universal.js` page object,
we can tell Reframe to hydrate only some parts of the page.
This means that, while these parts are DOM-dynamic, the rest of the page stays DOM-static.

This can be a significant performance improvement
when large portions of the page don't need to be DOM-dynamic.

It also introduces a separation between the DOM-static part and the DOM-dynamic part of the page,
which makes reasoning about the page easier.

To achieve such partial hydration,
instead of defining the page with one page object `MyDynamicPage.universal.js`,
we define the page with two page objects.
One page object `MyDynamicPage.html.js` for server-side rendering and
another `MyDynamicPage.dom.js` for browser-side rendering.
Like in the following.

~~~js
!INLINE ../example/pages/NewsPage.html.js
~~~

~~~js
!INLINE ../example/pages/NewsPage.dom.js
~~~

When we define a page with two separate page objects like this,
not only do we hydrate only what's necessary, but we also load only the code that is necessary.
Because only the `.dom.js` page object is loaded in the browser, and
the `.html.js` page object is never loaded in the browser.
For example, we can see that the `NewsPage.dom.js` file only loads `TimeComponent` and not the (imaginary) KB heavy `LatestNewsComponent`.

Note that we can set `view` to an array with more than one view object, and, in that way, we can hydrate several parts of the page.

Beyond being able to define partial hydration,
we can gain further control over what's happening in the browser
by writing the browser entry code ourselves.
(Instead of using the default browser entry code generated by Reframe.)



## Custom Browser JavaScript

If our page is saved as `pages/MyPage.html.js` and, if we save some JavaScript code saved as `pages/MyPage.entry.js`, then Reframe will take `pages/MyPage.entry.js` as browser entry point.
See the Customization Manual for further information.

We can as well add arbitrary script tags to the page's HTML (external scripts, async scripts, etc.).
See the "Custom Head" section.



## CSS & Static Assets

A CSS file can be loaded and applied by importing it.

~~~js
import './GlitterStyle.css';
~~~

Static assets (images, fonts, videos, etc.) can be imported as well
but importing an asset doesn't actually load it,
and instead the URL of the asset is returned.
It is up to us to use/fetch the URL of the asset.

~~~js
import diamondUrl from './diamond.png';

// do something with diamondUrl, e.g. `await fetch(diamondUrl)` or `<img src={diamondUrl}/>`
~~~

In addition, static assets can be referenced in CSS files by using the CSS `url` data type.

~~~css
.diamond-background {
    background-image: url('./diamond.png');
}
~~~

The following shows code using CSS and static assets as described above.

~~~js
!INLINE ../example/pages/GlitterPage.universal.js
~~~

~~~js
!INLINE ../example/views/GlitterComponent.js
~~~

~~~css
!INLINE ../example/views/GlitterStyle.css
~~~

Note that CSS and static assets are handled by webpack,
and we can customize the webpack configuration.
We referer to the Customization Manual for further information.

Also note that all types of static assets are supported.
(If you are curious,
we achieve this by using the `file-loader` as fallback,
i.e. we apply the `file-loader` to all files that are not handled by any other webpack loader.)



## Async Data

A common React use case is to display data that is fetched over the network.
The page object supports a `async getInitialProps()` property that Reframe calls every time and before the view is rendered.
(On both the server and in the browser.)
We can use `async getInitialProps()` to fetch the data that ourReact components require.

An example:

~~~js
!INLINE ../example/pages/GameOfThronesPage.html.js
~~~

~~~js
!INLINE ../example/views/GameOfThrones.js
~~~

Because `aysnc getInitialProps()` is called and waited for prior to rendering the HTML, our page's HTML `view-source:http://localhost:3000/game-of-thrones` displays the data already.

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Game of Thrones Characters</title>
        <meta name="description" content="List of GoT Characters">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div><h3>Game of Thrones Characters</h3><table border="7" cellPadding="5"><tbody><tr><td>Daenerys Targaryen</td></tr><tr><td>Jon Snow</td></tr><tr><td>Cersei Lannister</td></tr><tr><td>Petyr Baelish</td></tr><tr><td>Bran Stark</td></tr><tr><td>Tyrion Lannister</td></tr><tr><td>Varys</td></tr><tr><td>Tormund</td></tr><tr><td>Samwell Tarly</td></tr></tbody></table></div></div>
    </body>
</html>
~~~

Alternatively, we can fetch data in a statefull component.

~~~js
!INLINE ../example/pages/GameOfThrones2Page.universal.js
~~~

Note that,
when using such statefull component,
the server renders the HTML before the data is loaded.
In our case,
 this means that the HTML `view-source:http://localhost:3000/game-of-thrones-2`
displays the loading state `<div id="react-root"><div>Loading...</div></div>`.
And the HTML returned by the server is:

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Loading...</div></div>
        <script src="/commons.hash_451146e5dbcfe0b09f80.js" type="text/javascript"></script>
        <script src="/GameOfThrones2Page.entry.hash_2c79748d10c1e953f159.js" type="text/javascript"></script>
    </body>
</html>
~~~



## Links & Page Navigation

With Reframe's default setup, links are simply link tags such as `<a href="/about">About</a>`.

For example:

~~~js
!INLINE ../example/pages/page-a.html.js
~~~
~~~js
!INLINE ../example/pages/page-b.html.js
~~~

Reframe doesn't interfere when a link is clicked: the link follows through, and the new page is entirely loaded.

It is possible to customize Reframe to navigate pages by loading the page object of the new page instead of loading the entire page.
But we don't recommend going down that path,
as it adds non-negligible complexity,
while similar performance characteritics can be achieved using the [Turbo Link Technique](https://github.com/turbolinks/turbolinks).



## Custom Server

Instead of using the CLI, Reframe can be used as hapi plugin(s), as show in the next example.

~~~js
!INLINE ../example/custom/server/hapi-server.js
~~~

That way, we can create the hapi server ourselves, add routes to it, and configure it as we wish.

Reframe's server is fully customaziable, and
can be used with another server framework such as Express.
The Customization Manual elaborates on such possibilities.



## Custom Head

Reframe handles the outer part of HTML (including `<head>`, `<!DOCTYPE html`>, `<script>`, etc.) with `@brillout/html-crust`.

All options of `@brillout/html-crust` are available over the page object.
Thus, the page object has full control over the outer part of HTML including the `<head>`.

We refer to [`@brillout/html-crust`'s documentation](https://github.com/brillout/html-crust) for further information.

For example, the page object

~~~js
!INLINE ../example/pages/custom-html.html.js
~~~

creates a page with following HTML

~~~js
<!DOCTYPE html>
<html>
  <head>
    <title>Full custom head</title>
  </head>
  <body>
    <div>Full custom body</div>
  </body>
</html>
~~~



## 404 Page

A 404 page can be implement by using the `*` route:

~~~js
import React from 'react';

export default {
    route: '*',
    title: 'Not Found',
    view: props => (
        <div>
            The page {props.route.url.pathname} does not seem to exist.
        </div>
    ),
};
~~~



## Production Environment

By default, Reframe compiles for development.

We can tell Reframe to compile for production by
 - setting `process.env.NODE_ENV = 'production';` in Node.js, or by
 - setting `export NODE_ENV='production'` in a Unix(-like) OS, or by
 - running `reframe --prod` in a shell

When compiling for production,
the auto-reload feature is disabled,
the code is transpiled to support all browsers (only the last 2 versions of Chrome and Firefox are targeted when compiling for dev),
the code is minifed,
the low-KB production version of React is used,
etc.

The Reframe CLI displays a `[PROD]` notification when compiling for production:

~~~shell
$ export NODE_ENV='production'
$ reframe
✔ Page directory found at ~/tmp/reframe/example/pages/
✔ Frontend built at ~/tmp/reframe/example/dist/browser/ [PROD]
✔ Server running at http://localhost:3000
~~~



## Related External Docs

The following packages are used by Reframe.
 - [Repage](https://github.com/brillout/repage) - Low-level and unopinionted page management library.
 - [@brillout/html-crust](https://github.com/brillout/html-crust) - HTML outer part handler. (`<head>`, `<!DOCTYPE html>`, `<script>`, etc.)
 - [@brillout/find](https://github.com/brillout/find) - Package to find files. The Reframe CLI uses it to find the `pages/` directory.
 - [Rebuild](https://github.com/brillout/rebuild) - High-level asset bundling tool build on top of the low-level tool webpack.

