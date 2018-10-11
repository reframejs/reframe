The page config option `doNotRenderInBrowser` allow you to control whether or not the page is rendered in the browser.

By default a page is rendered in the browser so that it can have interactive views
(a like button, an interactive graph, a To-Do list, etc.).
But if a page has no interactive views then it is wasteful to render it in the browser.

 - `doNotRenderInBrowser: false` (default value)
   <br/>
   The page is **rendered in the browser**.
   <br/>
   The page's view (e.g. React components) and the view renderer (e.g. React) are loaded in the browser.
   <br/>
   The page's view is rendered to the DOM.
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

Setting `doNotRenderInBrowser: true` makes the page considerably faster as no (or much less) JavaScript is loaded and exectued.

So if your page has no interactive views, then you can set `doNotRenderInBrowser: true`.
More precisely, you can set `doNotRenderInBrowser: true` if your page's view is stateless.
E.g. a functional React component is always stateless and
if your page is composed of functional React components only, then you can set `doNotRenderInBrowser: true`.
