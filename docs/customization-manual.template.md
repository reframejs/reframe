!MENU
!MENU_ORDER 30



# Customization Manual

### Custom Browser JavaScript

##### Contents

 - [Custom Browser Entry](#custom-browser-entry)
 - [External Scripts](#external-scripts)
 - [Common Script](#common-script)
 - [Full Customization](#full-customization)

##### Custom Browser Entry

When Reframe stumbles upon a `.universal.js` or `.dom.js` page object, Reframe automatically generates a browser entry code that will be loaded in the browser.

The following is an example of such generated browser entry code.

~~~js
var hydratePage = require('/usr/lib/node_modules/@reframe/cli/node_modules/@reframe/browser/hydratePage.js');
var pageObject = require('/home/brillout/tmp/reframe-playground/pages/HelloPage.universal.js');

// hybrid cjs and ES6 modules import
pageObject = Object.keys(pageObject).length===1 && pageObject.default || pageObject;

hydratePage(pageObject);
~~~

We can, however, create the browser entry code ourselves.

Instead of providing a `.universal.js` or `.dom.js` page object, we providing only one page object `.html.js` along with a `.entry.js`

The following is an example

~~~js
!INLINE ../example/pages/TrackingPage.html.js
~~~

~~~js
!INLINE ../example/pages/TrackingPage.entry.js
~~~

##### External Scripts

The page's `<head>` is fully customaziable,
and we can load external scripts such as `<script async src='https://www.google-analytics.com/analytics.js'></script>`,
load a `<script>` as ES6 module,
add a `async` attribute to a `<script>`,
etc.

See the "Custom Head" section of the Usage Manual for more information.

##### Common Script

Multiple pages can share common code by using the `diskPath` script object property as shown in the following example;

~~~js
!INLINE ../example/custom/browser/pages/terms.html.js
~~~
~~~js
!INLINE ../example/custom/browser/pages/privacy.html.js
~~~
~~~js
!INLINE ../example/custom/browser/pages/PageCommon.js
~~~
~~~js
!INLINE ../example/custom/browser/pages/PageCommon.entry.js
~~~

##### Full Customization

We saw in the first section "Custom Browser Entry" how to write the browser entry code ourself.

An example would be

~~~js
import hydratePage from '@reframe/browser/hydratePage';
import MyPage from 'path/to/MyPage-page-object.js';

hydratePage(MyPage);
~~~

We can go further by not using `@reframe/browser/hydratePage` and re-writing that part ouserlves.

Let's look at the code of `@reframe/browser/hydratePage`

~~~js
!INLINE ../browser/hydratePage.js
~~~

As we can see, the code simply initializes Repage and calls Repage's `hydratePage()`.

Instead of using Repage we could manually hydrate the page ourselves as.
The following is an example of doing so.
At this point, our browser JavaScript doesn't depend on Reframe nor on Repage and is fully under our control.

~~~js
!INLINE ../example/custom/browser/pages/custom-browser.html.js
~~~
~~~js
!INLINE ../example/custom/browser/pages/custom-browser.entry.js
~~~

### Custom Server

##### Reframe as hapi plugin

Instead of using Reframe with its CLI, we can use Reframe as hapi plugins.
The following is an example of doing so.

~~~js
!INLINE ../example/custom/server.js
~~~


##### Full Customization


### Custom Build


### Full Customization

##### Custom Repage

##### Full Vanilla Customization

 - all the way to Repage
 - all the way to Vanilla JavaScript
