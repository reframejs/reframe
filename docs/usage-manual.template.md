!INLINE ./header.md --hide-source-path

!MENU
!MENU_ORDER 20

<br/>

# Usage Manual

#### Contents

###### Basics

 - [Getting Started](#getting-started)
 - [CSS & Static Assets](#css--static-assets)
 - [Async Data](#async-data)
 - [Links & Page Navigation](#links--page-navigation)
 - [Static Pages VS Dynamic Pages](#static-pages-vs-dynamic-pages)

###### Customization & Eject

 - [Custom/Eject Server](#customeject-server)
 - [Custom Webpack Config](#custom-webpack-config)
 - [Custom &lt;head&gt;, &lt;script&gt;, ...](#custom-head-script-)
 - [Custom/Advanced Routing](#customadvanced-routing)
<!--- TODO
 - [Custom Error Pages (404, 5xx, ...)](#custom-error-pages-404-5xx-)
 - [Custom/Eject Browser Code](#customeject-browser-code)
-->
<!--- TODO
 - [Custom/Eject Build](#customeject-build)
-->


## Getting Started

!INLINE ./start.md --hide-source-path



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
!INLINE ../examples/basics/pages/glitter/GlitterPage.config.js
~~~

~~~js
!INLINE ../examples/basics/pages/glitter/GlitterComponent.js
~~~

~~~css
!INLINE ../examples/basics/pages/glitter/GlitterStyle.css
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
!INLINE ../examples/basics/pages/got/GameOfThronesPage.config.js
~~~

~~~js
!INLINE ../examples/basics/pages/got/data/getCharacters.js
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
!INLINE ../examples/basics/pages/got/GameOfThronesPage2.config.js
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

See [Custom/Advanced Routing](#custom-advanced-routing) for alternative ways of navigating.

An example of basic page navigation:

~~~js
!INLINE ../examples/basics/pages/page-a.config.js
~~~
~~~js
!INLINE ../examples/basics/pages/page-b.config.js
~~~




## Static Pages VS Dynamic Pages

An cornerstone feature of the page config is that it allows you to configure a page to be "HTML-static" or "HTML-dynamic" and "DOM-static" or "DOM-dynamic":
 - *HTML-static*
   <br/>
   The page is rendered to HTML at build-time.
   <br/>
   (In other words, the page is rendered to HTML only once, when Reframe is building your app's pages.)
   <br/>
   Add `htmlStatic: true` to the page config.
 - *HTML-dynamic*
   <br/>
   The page is rendered to HTML at request-time.
   <br/>
   (In other words, the page is (re-)rendered to HTML every time the user requests the page.)
   <br/>
   Default setting.
 - *DOM-static*
   <br/>
   The page is not hydrated.
   <br/>
   (In other words, the DOM doesn't have any React component attached to it and the DOM will not change.)
   <br/>
   Add `domStatic: true` to the page config.
 - *DOM-dynamic*
   <br/>
   The page is hydrated.
   <br/>
   (In other words, React components are attached to the DOM and the page's DOM will eventually be updated by React.)
   <br/>
   Default setting.

Let's consider the following example:

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
And that's also because `domStatic: true` makes Reframe not hydrate the page:
`TimeComponent` is not attached to the DOM but is only used to generate the page's HTML.

Removing `htmlStatic: true` makes Reframe generate the HTML at request-time.
The page then shows the current time whenever the page (re-)loads.

Removing `domStatic: true` makes Reframe hydrate the page.
`TimeComponent` is attached to the page's DOM and the DOM is updated every second to always show the current time.

DOM-static pages are considerably more performant as the browser doesn't load nor render the page's React components.

And HTML-static pages are more performant as the HTML is rendered only once at build-time instead of being re-rendered on every request.

If all pages are HTML-static,
then all HTMLs are rendered at build-time,
no server code is required,
and the app can be deployed to a static website host
such as [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/).

Also,
keep in mind that DOM-dynamic views are inherently more complex than DOM-static views.
We recommended to implement app requirements with DOM-static views whenever possible,
and to implement DOM-dynamic views only when necessary.
Reframe embraces that recommandation by allowing you to write an app where only few pages are DOM-dynamic while the rest of the app is DOM-static.




## Custom/Eject Server

Running the command

~~~shell
$ reframe eject server
~~~

will copy the following file to your codebase.

~~~js
!INLINE ../plugins/server/startServer.js --hide-source-path
~~~

At this point you can:
 - Add custom routes
 - Add API endpoints
 - Add authentication endpoints
 - Use another server framework such as Express
 - Use a process manager such as PM2

The following command ejects the `HapiPluginServerRendering` plugin to gain control over the Server Side Rendering (the dynamic generation of the pages' HTML)

~~~shell
$ reframe eject server-rendering
~~~

And run

~~~shell
$ reframe eject server-assets
~~~

to eject the `HapiPluginStaticAssets` plugin and to gain control over the serving of static browser assets. (JavaScript files, CSS files, images, fonts, etc.)



## Custom Webpack Config

Save a `reframe.config.js` file at your app root directory and use the `webpackBrowserConfig` and/or `webpackNodejsConfig` Reframe configs.

~~~js
// reframe.config.js

module.exports = {
    webpackBrowserConfig: webpackConfig,
    webpackNodejsConfig: webpackConfig,
};

function webpackConfig({
    config,

    // Webpack entries
    // For `webpackNodejsConfig` this is the list of found page config paths
    // For `webpackBrowserConfig` this is the list of (generated) browser entry files
    entries,

    // The directory where the built assets are expected to be
    outputPath,

    // Config modifiers provided by the package `@brillout/webpack-config-mod`
    setRule, getRule, getEntries, addBabelPreset, addBabelPlugin, modifyBabelOptions
}) {
    // Either
    //  - apply modifications to `config` (by using modifiers or manually), or
    //  - return an entirely new config object (by using `entries` and `outputPath`)

    return config;
}
~~~

Docs of the `@brillout/webpack-config-mod` config modifiers at [/helpers/webpack-config-mod](/helpers/webpack-config-mod).

Examples:
 - Using modifiers [/examples/custom-webpack](/examples/custom-webpack)
 - Fully custom config [/examples/custom-webpack-full](/examples/custom-webpack-full)
 - Source code of [`@reframe/postcss`](/plugins/postcss)
 - Source code of [`@reframe/react`](/plugins/react)
 - Source code of [`@reframe/typescript`](/plugins/typescript)




## Custom &lt;head&gt;, &lt;script&gt;, ...

Reframe handles the outer part of HTML (including `<head>`, `<!DOCTYPE html`>, `<script>`, etc.) with `@brillout/html-crust`.

All options of `@brillout/html-crust` are available over the page config.
Thus, the page config has full control over the outer part of HTML including the `<head>`.

We refer to [`@brillout/html-crust`'s documentation](https://github.com/brillout/html-crust) for further information.




<!--- TODO
## Custom/Eject Browser Code

TODO
-->







## Custom/Advanced Routing

###### Reframe's default router

By default, Reframe uses [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) to match URLs with a the page config's `route`.
(React Router uses `path-to-regexp` as well.)

For example, in the following page config, Reframe will use `path-to-regexp` to determine if a URL matches the page's route `'/hello/:name'`.

~~~jsx
const HelloPage = {
    route: '/hello/:name',
    view: ({route: {args: {name}}}) => <div>Welcome {name}</div>,
};
~~~

See [`path-to-regexp`'s docs](https://github.com/pillarjs/path-to-regexp) for further information about the route string syntax.

###### Advanced routing with React Router

You can use React Router's components by adding the plugin [`@reframe/react-router`](/react-router).

Using React Router components allow you to implement:
 - **pushState-navigation**
   <br/>
   To navigate to a new page by manipulating the DOM instead of loading the new page's HTML.
   (A detailed explanation of "pushState-navigation" follows below.)
   Such navigation make sense for route changes that cause only small changes on the page.
   It would for example be prohibitive to reload the entire page for a URL change that causes only minor changes to a little box on the page.
 - **Nested Routes**
   <br/>
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

We refer to the source code of the plugin [`@reframe/crossroads`](/plugins/crossroads) for further information about how to use Reframe with another routing library.





<!--- TODO
## Custom Error Pages (404, 5xx, ...)

TODO

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
-->





<!--- TODO
## Custom/Eject Build

TODO
-->
