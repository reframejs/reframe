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

Let's revisit the HTML-static and DOM-static hello world page of the introduction.

#### HTML-static & DOM-static

A hello world page definition:

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

Upon running the `reframe` CLI a Node.js/hapi server that serving our page is created:

~~~shell
$ npm install -g @reframe/cli
~~~

~~~shell
$ reframe
✔ Page directory found at /home/alice/code/my-project/reframe-example/pages
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
~~~

As shown at view-source:http://localhost:3000/hello the HTML of our page is:

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

Because of `htmlIsStatic: true` Reframe will build the HTML on build-time, thus the page's HTML is static.
We don't load any JavaScript and the DOM is static as well.

Now let's consider a more dynamic example where we display the current date.

#### HTML-dynamic & DOM-static

We display the current date.
We also display a timestamp so we can see when the page has been generated.

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
This means that the HTML is rerendered on every request, thus the page's HTML is dynamic.

We still don't load any JavaScript and the page's DOM is static.
Let's now load some JavaScript to update the DOM every second in order to always show the current time.

#### HTML-dynamic & DOM-dynamic

Note that all previous filenames endeded with `.html.js`: `HelloPage.html.js`, `DatePage.html.js`, and `TimePage.html.js`.

This time we save our page object in a filename ending with `.universal.js`: `TimePage.universal.js`.
This is how we tell Reframe to render the view on the browser. (Reframe will then call `ReactDOM.hydrate()`.)

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
The JavaScript code (that bundles React and `TimeComponent`) mounts a `<TimeComponent/>` element onto the DOM.
The mounted `<TimeComponent/>` then updates the DOM every second and the current time is continuously updated.

When Reframe sees a `.universal.js` file in the `pages` directory it will generate JavaScript code that acs as an entry point for the browser.
You can see generated entry point source code at `~/code/@reframe/example/pages/dist/browser/source/TimePage.entry.js`.

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

~~~js
// /example/pages/NewsPage.html.js

import React from 'react';

import {TimeComponent} from '../views/TimeComponent';

const NewsComponent = () => (
    <div>
        <div>
            <h1>World News</h1>
            <p>
                Imagine this is a news site with a bunch of DOM-static content
                and the only DOM-dyanmic part of the website is a little snippet
                at the bottom showing the current time.
            </p>
            <p>
                The whole website doesn't require any DOM manipulation other than
                the time that needs to be updated every second.
            </p>
            <p>
                It would be wasteful to load the entire news site rendering logic
                on the browser just to update the current time.
                Instead we only render the time snippet on the browser.
                We call this *partial DOM-dynamic*
            </p>

            <h3>Some headline</h3>
            <p>
                Some interesting new thing...
            </p>

            <h3>Something happened today in Japan</h3>
            <p>
                Today in Japan...
            </p>
        </div>
        <br/>
        <small style={{color: 'blue'}}>
            Time: <span id="time-root"><TimeComponent /></span>
        </small>
    </div>
);

export default {
    title: 'News Site',
    route: '/news',
    view: NewsComponent,
};
~~~

~~~js
// /example/pages/NewsPage.dom.js

import React from 'react';

import {TimeComponent} from '../views/TimeComponent';

export default {
    route: '/news',
    view: {
        containerId: 'time-root',
        view: TimeComponent,
    },
};
~~~

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
