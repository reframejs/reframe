!INLINE ./header.md --hide-source-path

!MENU
!MENU_ORDER 30

<br/>

# Usage Manual

The usage manual acts as reference for using Reframe wihtout advanced customization.
This manual covers most common use cases.

#### Contents

###### Basic Usage

 - [Getting Started](#getting-started)
 - [Static Pages VS Dynamic Pages](#static-pages-vs-dynamic-pages)
 - [CSS & Static Assets](#css--static-assets)
 - [Async Data](#async-data)
 - [Links & Page Navigation](#links--page-navigation)
 - [Production Environment](#production-environment)

###### Further Usage

 - [Custom Server](#custom-server)
 - [Custom Head](#custom-head)
 - [404 Page](#404-page)
 - [Advanced Routing](#advanced-routing)
 - [Custom Browser JavaScript](#custom-browser-javascript)
 - [Related External Docs](#related-external-docs)



## Getting Started

!INLINE ./start.md --hide-source-path



## Static Pages VS Dynamic Pages

!INLINE ./universal-page-config.md --hide-source-path

By default, a page is HTML-dynamic and DOM-dynamic.
A page is made HTML-static by setting `htmlStatic: true` in its page config,
And by setting `domStatic: true`, the page is made DOM-static.

For example:

~~~js
// /pages/TimePage.js

import TimeComponent from '../views/TimeComponent';

export default {
    route: '/',
    view: TimeComponent,
    htmlStatic: true,
    domStatic: true,
};
~~~

~~~jsx
// /views/TimeComponent

!INLINE ../examples/basics/views/TimeComponent.js --hide-source-path
~~~

The page will always display the same time, namely the time when the page's HTML was generated at build-time.
That's because `htmlStatic: true` makes Reframe generate the HTML at build-time (instead of request-time).
And also because `domStatic: true` makes Reframe not hydrate the page, in other words, `TimeComponent` is not attached to the DOM, it is not loaded in the browser, and it is only used to generate the page's HTML.

Removing `htmlStatic: true` makes Reframe generate the HTML at request-time, and the page then shows the current time whenever the page (re-)loads.

Removing `domStatic: true` makes Reframe hydrate the page, and the page's DOM is updated every second to always show the current time.

DOM-static pages are considerably more performant as the browser doesn't have to load nor render the page's React components.

And HTML-static pages are more performant as the HTML is rendered only once at build-time instead of being re-rendered on every request.

If all pages are HTML-static,
then all HTMLs are rendered at build-time,
no server code is required,
and the app can be deployed to a static website host
such as [GitHub Pages](https://pages.github.com/) or Netlify.

Also,
keep in mind that interactive views are inherently and considerably more complex than static views.
It is recommended to implement app requirements with static views whenever possible,
and to implement interactive views only when necessary.
Reframe embraces that recommandation by allowing you to write web apps where a majority of the pages are DOM-static.

## CSS & Static Assets

A CSS file can be loaded and applied by importing it.

~~~js
import './GlitterStyle.css';
~~~

Static assets (images, fonts, videos, etc.) can be imported as well
but importing an asset doesn't actually load it:
Only the URL of the asset is returned.
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
!INLINE ../examples/basics/pages/GlitterPage.config.js
~~~

~~~js
!INLINE ../examples/basics/views/GlitterComponent.js
~~~

~~~css
!INLINE ../examples/basics/views/GlitterStyle.css
~~~

Note that CSS and static assets are handled by webpack,
and that the webpack config is fully customizable.
We referer to the Customization Manual for further information.

Also note that all types of static assets are supported.



## Async Data

A common React use case is to display data that is fetched over the network.
The page config supports a `async getInitialProps()` property that Reframe calls every time and before the view is rendered.
(On both the server and in the browser.)
We can therefore use `async getInitialProps()` to fetch the data that page's React components require.

For example:

~~~js
!INLINE ../examples/basics/pages/GameOfThronesPage.js
~~~

~~~js
!INLINE ../examples/basics/views/GameOfThrones.js
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
!INLINE ../examples/basics/pages/GameOfThrones2Page.js
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

The basic way to navigate between pages is to use link tags such as `<a href="/about">About</a>`.

See [Advanced Routing](#advanced-routing) for alternative ways of navigating.

An example of basic page navigation:

~~~js
!INLINE ../examples/basics/pages/page-a.config.js
~~~
~~~js
!INLINE ../examples/basics/pages/page-b.config.js
~~~



## Production Environment

By default, Reframe compiles for development.

We can tell Reframe to compile for production by
 - setting `process.env.NODE_ENV = 'production';` in Node.js, or by
 - setting `export NODE_ENV='production'` in a Unix(-like) OS, or by
 - running `reframe --prod` in the shell

When compiling for production,
the auto-reload feature is disabled,
the code is transpiled to support all browsers (only the last 2 versions of Chrome and Firefox are targeted when compiling for dev),
the code is minifed,
the low-KB production version of React is used,
etc.

The Reframe CLI displays a `[PROD]` notification when compiling for production:

~~~shell
$ reframe --prod
✔ Page directory found at ~/tmp/reframe/example/pages/
✔ Frontend built at ~/tmp/reframe/example/dist/browser/ [PROD]
✔ Server running at http://localhost:3000
~~~



## Custom Server

Instead of using the CLI, Reframe can be used as hapi plugin(s), as shown in the next example.

~~~js
!INLINE ../examples/custom/server/hapi-server.js
~~~

That way, we can create the hapi server ourselves, add routes to it, and configure it as we wish.

Reframe's server is fully customaziable, and
can be used with another server framework such as Express.
The Customization Manual elaborates on such possibilities.



## Custom Head

Reframe handles the outer part of HTML (including `<head>`, `<!DOCTYPE html`>, `<script>`, etc.) with `@brillout/html-crust`.

All options of `@brillout/html-crust` are available over the page config.
Thus, the page config has full control over the outer part of HTML including the `<head>`.

We refer to [`@brillout/html-crust`'s documentation](https://github.com/brillout/html-crust) for further information.

For example, the page config

~~~js
!INLINE ../examples/basics/pages/custom-html.js
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

A 404 page can be implement by using a catch-all route:

~~~js
import React from 'react';

export default {
    route: '/:params*',
    title: 'Not Found',
    view: props => (
        <div>
            The page {props.route.url.pathname} does not seem to exist.
        </div>
    ),
};
~~~



## Advanced Routing

###### Reframe's default router

By default, Reframe uses [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) to match URLs with a route.
(React Router uses `path-to-regexp` as well.)

For example, in the following page config, Reframe will use `path-to-regexp` to determine if a URL matches the page's route `'/hello/:name'`.

~~~jsx
const HelloPage = {
    route: '/hello/:name',
    view: ({route: {args: {name}}}) => <div>Welcome {name}</div>,
};
~~~

See [`path-to-regexp`'s docs](https://github.com/pillarjs/path-to-regexp) for further information about the route string syntax.

###### React Router

You can use React Router's components by adding the plugin [`@reframe/react-router`](/react-router).

Using React Router components allow you to implement:
 - **pushState-navigation**
   <br/>
   What "pushState-navigation" means is explained below.
 - **Nested Routes**
   <br/>
   For pages that differ in only some parts, in other words, where the majority of the view is the same.
 - **SPAs**
   <br/>
   Apps where the app's entire browser-side code is bundled in one script and loaded at once.
 - **URL hash**
   <br/>
   URLs with a `window.location.hash`.

###### Html-navigation VS pushState-navigation

There are two ways of navigating between pages:
 - *HTML-navigation*
   <br/>
   When clicking a link, the new page's HTML is loaded.
   (In other words, the browser discards the current DOM and builds a new DOM upon the new page's HTML.)
 - *pushState-navigation*
   <br/>
   When clicking a link, the URL is changed by `history.pushState()` and the DOM is manipulated (instead of loading the new page's HTML).

By default, Reframe does HTML-navigation when using `<a>` links between pages defined with page configs.

###### pushState-navigation

By using React Router's components you can do pushState-navigation.
Pages are then defined by React Router's component instead of page configs.

Note that with *page* we denote any view that is identified with a URL:
If two URLs have similar views that differ in only in a small way,
we still speak of two pages because these two views have two different URLs.

Also note that the broswer-side code is splitted only between pages defined with page configs,
and pages defined with React Router components will share the same browser-side code bundle.

###### Custom router

Reframe can be used with any routing library.

It can, for example, be used with [Crossroads.js](https://github.com/millermedeiros/crossroads.js).

We refer to the source code of the plugin [`@reframe/crossroads`](/crossroads) for further information about how to use Reframe with another routing library.


## Custom Browser JavaScript

If our page is saved as `pages/MyPage.html.js` and, if we save a JavaScript file as `pages/MyPage.entry.js`, then Reframe will take `pages/MyPage.entry.js` as browser entry point.
See the Customization Manual for further information.

We can as well add arbitrary script tags to the page's HTML (external scripts, async scripts, etc.).
See the "Custom Head" section.
