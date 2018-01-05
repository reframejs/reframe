<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.






-->
[Introduction](/../../)<br/>
[Getting Started](/docs/getting-started.md)<br/>
[API](/docs/api.md)

In this getting started
we start writing an HTML-static and DOM-static hello world example and we progresivelly change the example to make it HTML-dynamic and DOM-dynamic.

# Getting Started

#### Contents
 - [HTML-static & DOM-static](#html-static-dom-static)
 - [HTML-dynamic & DOM-static](#html-dynamic-dom-static)
 - [HTML-dynamic & DOM-dynamic](#html-dynamic-dom-static)
 - [HTML-dynamic & partial DOM-dynamic](#html-dynamic-partial-dom-dynamic)

Let's revisit the simple HTML-static and DOM-static page of the introduction.

#### HTML-static & DOM-static

Let's create a static hello world page:

~~~js
// /example/pages/HelloPage.html.js

const React = require('react');

const HelloComponent = () => <div>Hello World</div>;

const HelloPage = {
    title: 'Hello there', // Page's title
    description: 'A Hello World page created with Reframe.',
    route: '/hello', // Page's URL
    view: HelloComponent,
    htmlIsStatic: true, // Let Reframe know that HelloPage's HTML is static.
};

module.exports = HelloPage;
~~~

Running the `reframe` CLI will spin up a Node.js/hapi server and serve our newly created hello world page:

~~~shell
$ npm install -g @reframe/cli
~~~

~~~shell
$ reframe
✔ Page directory found at /home/alice/code/my-project/reframe-example/pages
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
~~~

And the source code of the page as shown at view-source:http://localhost:3000/hello is:

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

Because of `htmlIsStatic: true` Reframe will build the HTML is static as it is generated on build-time
and since no JavaScript is loaded the DOM is static as well.

Now let's consider a more dynamic example where we display the current date.

#### HTML-dynamic & DOM-static

We display the current date and to make sure that the page's HTML is recreated everytime we hit the server we also display a timestamp showing when the page the HTLM has rendered.

~~~js
// /example/pages/DatePage.html.js

import React from 'react';

import {toTimeString} from '../views/TimeComponent';

export default {
    title: 'Current Date',
    route: '/date',
    view: () => {
        const now = new Date();
        return (
            <div>
                <div>Date: {now.toDateString()}</div>
                <small>(Generated at {toTimeString(now)})</small>
            </div>
        );
    },
    htmlIsStatic: false, // This time, we let Reframe know that the HTML is not static
};
~~~

If the current time would be 1/1/2018 1:37 PM then the source code would be

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
The HTML is rerendered on every request.

The page's HTML is dynamic
and since we still don't load any JavaScript the page's DOM is static.
Let's now load some JavaScript to update the DOM every second in order to always show the current time.

#### HTML-dynamic & DOM-dynamic

Note that all previous filenames endeded with `.html.js`: `HelloPage.html.js`, `DatePage.html.js`, and `TimePage.html.js`.

This time we save our page object in a filename ending with `.universal.js`: `TimePage.universal.js`.
This is how we tell Reframe to render the view on the browser. (Reframe will call `ReactDOM.hydrate()`.)

~~~js
// /example/pages/TimePage.universal.js

import React from 'react';

import {TimeComponent} from '../views/TimeComponent';

export default {
    title: 'Current Time',
    route: '/time',
    view: TimeComponent,
};
~~~

And the source code of view-source:http://localhost:3000/hello is:

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

As the source code shows we load JavaScript code.
The code bundles React and `TimeComponent` and mounts a `<TimeComponent/>` element onto the DOM.
The mounted `<TimeComponent/>` then updates the DOM every second and the current time is continuously updated.

When Reframe sees a `.universal.js` file in the `pages` directory it will generate an entry point for the browser.
You can see the source code that acts as entry point that Reframe automatically generates at `~/code/@reframe/example/pages/dist/browser/source/TimePage.entry.js`.

The entry point generated by Reframe includes the whole .universal.js and the whole view is loaded to the browser.
This is fine if you the view of the whole page isn't too KB heavy or if the whole page needs to by hydrated anyways.
But you can also choose to hydrate only a small part of your page so that you don't have to load the entire page view logic onto the browser. We call this "partial DOM-dynamic" and we'll see how to that in a bit. Before that let's see how to create the browser entry point yourself.

You can also create the JavaScript browser entry point yourself.

#### Custom Browser Entry Point + External Scripts

<script async src='https://www.google-analytics.com/analytics.js'></script>

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


#### HTML-dynamic & partial DOM-dynamic



#### Production build & server




<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/getting-started.template.md` instead.






-->
