The page config option `doNotRenderInBrowser` allow you to control whether or not the page is rendered in the browser.

By default a page is rendered in the browser so that it can have interactive views
(a like button, an interactive graph, a To-Do list, etc.).

 - `doNotRenderInBrowser: false` (default value)
   <br/>
   The page is **rendered in the browser**.
   <br/>
   The page's code (e.g. React components) and the view library (e.g. React) are loaded in the browser.
   <br/>
   The page's views are rendered to the DOM.
   (E.g. with `ReactDOM.hydrate`.)
   <br/>
   The DOM may change.
 - `doNotRenderInBrowser: true`
   <br/>
   The page is **not rendered in the browser**.
   <br/>
   No JavaScript (or much less JavaScript) is loaded in the browser.
   <br/>
   The DOM will not change.

Setting `doNotRenderInBrowser: true` makes the page considerably faster.
So if your page has no interactive views, then you should set `doNotRenderInBrowser: true`.
(Precisely speaking, you should set `doNotRenderInBrowser: true` when your page's views are stateless.)

By setting `doNotRenderInBrowser: true` to all your pages,
you remove browser-side JavaScript.
In other words you remove the frontend:
The view library (React/Vue/etc.) is only used on the server as an HTML template engine.
