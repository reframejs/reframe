!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<h1>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
Overview
</h1>

<br/>

<div><p align="center">
<a href="#easy">Easy</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#example">Example</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#quick-start">Quick Start</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#progressive-eject">Progressive Eject</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#universal">Universal</a>
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;
<a href="#tech-specs">Tech Specs</a>
</p></div>

&nbsp;

### Easy

Reframe allows you to create web apps by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

~~~jsx
// A page config
const WelcomePage = {
  route: '/',
  view: () => <div>Welcome to Reframe</div>,
  title: 'Welcome'
};
~~~

A *page config* is a plain JavaScript object that configures a page by assigning it
 - a React component,
 - a route, and
 - further optional page configurations

You can create an app with **no build configuration** and **no server configuration**.

> All you need to create a web app is one React component and one page config per page.

<br/>

### Example

In the following we create a web app
by defining a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

Reframe does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe_overview_screenshot.png?sanitize=true' width=1200 style="max-width:100%;"/>
</p>

That's it: We created a web app by simply defining one page config.

<br/>

### Quick Start

!INLINE ./start.md --hide-source-path

To familiarize yourself with Reframe,
read the source code of `my-app/`,
check out the [Usage Manual](/docs/usage-manual.md),
and read this overview.

<br/>

### Progressive Eject

All of Reframe is ejectable and customizable.

For example, the command `reframe eject server` ejects [~30 LOC of server code](/plugins/server/startServer.js):
The server code is copied from Reframe's codebase to your codebase.
Giving you control over the server and allowing you to add API endpoints, change the server config, use a process manager, etc.

There are several eject commands that you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

<br/>

### Universal

Reframe is universal (you can create any type of web app)
thanks to two page config options: `htmlStatic: true` and `domStatic: true`.

By default a page is rendered twice:
On the server (to HTML) and in the browser (to the DOM).
(React components can be rendered to the DOM as well as to HTML.)

Because it is rendered in the browser, a page can have interactive views
(a like button, a realtime graph, a To-Do list, etc.).
But if a page has no interactive views then it is wasteful to render it in the browser.
By adding `domStatic: true` to its page config, the page is only rendered on the server.
The browser loads no (or almost no) JavaScript and the DOM is static.

By default a page is dynamically rendered to HTML at request-time.
But some pages are static
(a landing page, a blog post, a personal homepage, etc.) and it would be wasteful to re-render its HTML on every page request.
By adding `htmlStatic: true` to a page config, the page is rendered to HTML at build-time instead.

Thus, you can create:

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup> - Apps with interactive views. (The DOM is dynamic.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup> - Apps without interactive views. (The DOM is static.)
 - **Serverless apps** - Apps with static HTML. (No Node.js server is needed as all pages' HTMLs are rendered at built-time.)
 - **Hybrid apps** - Apps where some pages have a static HTML and some have a static DOM.

<br/>

### Tech Specs

###### Developer Experience

- **Mostly-non-interactive apps**
  <br/>
  You can write an app that has only few interactive views while the rest is non-interactive.
  <br/>
  Following the approach "Whenever possible, implement features with non-interative views".
  (Non-interactive views are considerably easier to implement.)
- **Serverless deploy**
  <br/>
  If your app is HTML-static
  (by setting `htmlStatic: true` to all your page configs)
  then it can be deployed to a static website host
  such as [GitHub Pages](https://pages.github.com/) or [Netlify](https://www.netlify.com/).
- **React Router**
  <br/>
  The syntax of the page config's `route` string is the same than in React Router v4.
  <br/>
  By adding the [@reframe/react-router](/plugins/react-router) plugin
  you can use React Router's components `<Route>`, `<Switch>`, etc.
- **TypeScript**
  <br/>
  Add the [@reframe/typescript](/plugins/typescript) plugin and write your app in TypeScript.
- **PostCSS**
  <br/>
  Add the [@reframe/postcss](/plugins/postcss) plugin to write modern CSS.
- **Webpack**
  <br/>
  Reframe uses webpack to build the app's pages.
  Webpack
  ([webpack.js.org](https://webpack.js.org/))
  is the state of the art to build browser assets.
- **Hapi**
  <br/>
  Reframe uses hapi to create the server.
  Hapi
  ([hapijs.com](https://hapijs.com/))
  is known for its robustness and scalability.

###### SEO

- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, pages are entirely rendered to HTML giving you full control over SEO.

###### Performance

- **Code-splitting**
  <br/>
  By default a page loads two scripts:
  One script that is shared and cached across all pages
  (that includes React, polyfills, etc.)
  and a second script that includes the React components of the page.
  That way, a page only loads what it needs.
- **Static DOM**
  <br/>
  When setting `domStatic: true` to a page config, the page is not hydrated.
  (In other words, the page is not rendered to the DOM but only rendered to HTML.)
  Not only is computational time saved by skiping rendering to the DOM but also load time is saved by skipping loading JavaScript code.
- **Server-Side Rendering** (**SSR**)
  <br/>
  By default, pages are rendered to HTML before being rendered to the DOM in the browser.
  Improving the user perceived load time.
- **Optimal HTTP caching**
  <br/>
  Every dynamic server response is cached with a ETag header.
  And every static server response is indefinitely cached.
  (A static asset is served under a URL that contains the assets' hash
  and is served with the `Cache-Control` header set to `immutable` and `max-age`'s maximum value.)
- **Static Rendering**
  <br/>
  When setting `htmlStatic: true` to a page config, the page is rendered to HTML at build-time (instead of request-time).
  The page's HTML is rendered only once, when Reframe is building the pages, and is served statically.
  Decreasing load time.
