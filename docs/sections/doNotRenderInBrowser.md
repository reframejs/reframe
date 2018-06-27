The page config option `doNotRenderInBrowser` allow you to control whether or not your page is rendered in the browser.

 - `doNotRenderInBrowser: false` (default value)
   <br/>
   The page is **rendered in the browser**.
   <br/>
   The page's view (e.g. React components) and the view renderer (e.g. React) is loaded in the browser.
   <br/>
   The DOM may eventually change since the page is rendered to the DOM.
 - `doNotRenderInBrowser: true`
   <br/>
   The page is **not rendered in the browser**.
   <br/>
   (Almost) no JavaScript is loaded in the browser.
   <br/>
   The DOM will not change since the page is not rendered to the DOM.

By default a page is rendered in the browser so that it can have interactive views
(a like button, an interactive graph, a To-Do list, etc.).
But if a page has no interactive views then it is wasteful to render it in the browser.
