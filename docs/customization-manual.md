<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.






-->
[Overview](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Customization Manual](/docs/customization-manual.md)



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
// /example/pages/TrackingPage.html.js

import React from 'react';

import {TimeComponent} from '../views/TimeComponent';

export default {
    title: 'Tracking Example',
    route: '/tracker',
    view: () => <div>Hi, you are being tracked. The time is <TimeComponent/></div>,
    scripts: [
        {
            async: true,
            src: 'https://www.google-analytics.com/analytics.js',
        },
    ],
};
~~~

~~~js
// /example/pages/TrackingPage.entry.js

import hydratePage from '@reframe/browser/hydratePage';
import TrackingPage from './TrackingPage.html.js';

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');

(async () => {
    const before = new Date();
    // we are reusing the .html.js page definition `TrackingPage` but
    // we could also use another page definition
    await hydratePage(TrackingPage);
    const after = new Date();
    ga('send', 'event', {eventAction: 'page hydration time', eventValue: after - before});
})();

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
// /example/pages/terms.html.js

import React from 'react';
import PageCommon from './PageCommon';

export default {
    route: '/terms',
    view: () => (
        <div>
            <h1>Terms of Service</h1>
            <div>
                The long beginning of some ToS...
            </div>
        </div>
    ),
    ...PageCommon,
};
~~~
~~~js
// /example/pages/privacy.html.js

import React from 'react';
import PageCommon from './PageCommon';

export default {
    route: '/privacy',
    view: () => (
        <div>
            <h1>Privacy Policy</h1>
            <div>
                Some text about privacy policy...
            </div>
        </div>
    ),
    ...PageCommon,
};

~~~
~~~js
// /example/pages/PageCommon.js

const PageCommon = {
    title: 'Jon Snow',
    description: 'This is the homepage of Jon Snow',
    htmlIsStatic: true,
    scripts: [
        {
            async: true,
            src: 'https://www.google-analytics.com/analytics.js',
        },
        {
            diskPath: './PageCommon.entry.js',
        },
    ],
};

export default PageCommon;
~~~
~~~js
// /example/pages/PageCommon.entry.js

window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create', 'UA-XXXXX-Y', 'auto');
ga('send', 'pageview');
console.log('pageview tracking sent');
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
// /browser/hydratePage.js

const assert = require('reassert');
const assert_usage = assert;

const Repage = require('@repage/core');
const {hydratePage: repage_hydratePage} = require('@repage/browser');

const RepageRouterCrossroads = require('@repage/router-crossroads/browser');
const RepageRenderer = require('@repage/renderer/browser');
const RepageRendererReact = require('@repage/renderer-react/browser');
const RepageNavigator = require('@repage/navigator/browser');

module.exports = hydratePage;

async function hydratePage(page) {
    const repage = new Repage();

    repage.addPlugins([
        RepageRouterCrossroads,
        RepageRenderer,
        RepageRendererReact,
        RepageNavigator,
    ]);

    return await repage_hydratePage(repage, page);
}
~~~

As we can see, the code simply initializes Repage and calls Repage's `hydratePage()`.

Instead of using Repage we could manually hydrate the page ourselves as.
The following is an example of doing so.
At this point, our browser JavaScript doesn't depend on Reframe nor on Repage and is fully under our control.

~~~js
// /example/custom/browser/pages/custom-browser.html.js

import React from 'react';
import {TimeComponent} from '../../../views/TimeComponent';

export default {
    route: '/custom-hydration',
    view: () => (
        <div>
            <div>
                Some static stuff.
            </div>
            <div>
                Current Time:
                <span id="time-hook">
                    <TimeComponent/>
                </span>
            </div>
        </div>
    ),
    htmlIsStatic: true,
};
~~~
~~~js
// /example/custom/browser/pages/custom-browser.entry.js

import React from 'react';
import ReactDOM from 'react-dom';

import {TimeComponent} from '../../../views/TimeComponent';

ReactDOM.hydrate(<TimeComponent/>, document.getElementById('time-hook'));
~~~

### Custom Server


### Custom Build


### Full Customization

##### Custom Repage

##### Full Vanilla Customization

 - all the way to Repage
 - all the way to Vanilla JavaScript

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/customization-manual.template.md` instead.






-->
