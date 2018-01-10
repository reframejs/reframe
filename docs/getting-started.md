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
[Overview](/../../)<br/>
[Getting Started](/docs/getting-started.md)<br/>
[API](/docs/api.md)

This getting started explains how to create *page objects* for
HTML-static, HTML-dynamic, DOM-static, and DOM-dynamic pages.

# Getting Started

Reframe revolves around *page objects* wich are JavaScript objects that define pages.

#### Contents

 - [HTML-static & DOM-static](#html-static-dom-static)
 - [HTML-dynamic & DOM-static](#html-dynamic-dom-static)
 - [HTML-dynamic & DOM-dynamic](#html-dynamic-dom-static)
 - [HTML-dynamic & partial DOM-dynamic](#html-dynamic-partial-dom-dynamic)
 - [CSS](#css)
 - [Async Data](#async-data)
 - [Production Environment](#production-environment)


#### HTML-static & DOM-static

A hello world page definition:

~~~js
// /example/pages/HelloWorldPage.html.js

const React = require('react');

const HelloWorldComponent = () => <div>Hello World</div>;

const HelloWorldPage = {
    title: 'Hello there', // Page's title
    description: 'A Hello World page created with Reframe.',
    route: '/hello', // Page's URL
    view: HelloWorldComponent,
    htmlIsStatic: true, // Let Reframe know that HelloPage's HTML is static.
};

module.exports = HelloWorldPage;
~~~

Upon running the `reframe` CLI a Node.js/hapi server serving our page is created:

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

Because of `htmlIsStatic: true` Reframe generates the HTML on build-time and the page's HTML is static.
We don't load any JavaScript and the DOM is static as well.


Let's consider a more dynamic example.

#### HTML-dynamic & DOM-static

We implement a page that displays the current date without time.
We also display a timestamp to see when the page has been generated.

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
    htmlIsStatic: false, // We let Reframe know that the HTML is not static
                         // so that Reframe re-renders a new HTML
                         // with the current date on every request
};
~~~

If the current time would be 1/1/2018 1:37 PM then the HTML code would be

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
This means that the HTML is re-rendered on every request and the page's HTML is dynamic.

We still don't load any JavaScript, the page's DOM is static. We call this page a HTML-dynamic DOM-static page.

Another example of a HTML-dynamic DOM-static page is the `HelloPage.html.js` of the overview.

~~~js
// /example/pages/HelloPage.html.js

const React = require('react');

const HelloComponent = props => <div>Hello {props.route.args.name}</div>;

const HelloPage = {
    title: 'Hi there', // page's title
    route: '/hello/{name}', // page's URL
    view: HelloComponent,
};

module.exports = HelloPage;
~~~

Note that the route `/hello/{name}` of `HelloPage.html.js` is parameterized and it because of that it can't be HTML-static; There is an infinite number of pages with URLs `/hello/Alice-1`, `/hello/Alice-2`, `/hello/Alice-3`, etc. and we can't compute them all at build-time and the page has to be HTML-dyanmic.
In general, all pages that have a parameterized route are HTML-dynamic.


Let's now look at a DOM-dynamic page.

#### HTML-dynamic & DOM-dynamic

We create a page that loads JavaScript code that updates the time every second by manipulating the DOM with React.

Note that we save our page object file as `TimePage.universal.js`.
The filename ends with `.universal.js`
whereas all previous filenames end with `.html.js`.
(`HelloPage.html.js`, `DatePage.html.js`, and `TimePage.html.js`.)

By saving a page object with a `universal.js` suffix we tell Reframe that the view is to be rendered on the browser as well.
(Reframe will then call `ReactDOM.hydrate()`.)

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

And the HTML code of view-source:http://localhost:3000/hello is:

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

As the HTML code shows JavaScript code is loaded.
When this JavaScript code runs, a `<TimeComponent/>` element is mounted onto the DOM.
The mounted `<TimeComponent/>` then updates the DOM every second and the current time is continuously updated.

When Reframe sees a `.universal.js` file in the `pages` directory it will generate JavaScript code that acts as entry point for the browser.
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
    view: {
        containerId: 'time-root',
        view: TimeComponent,
    },
};
~~~

#### CSS

~~~js
// /example/pages/GlitterPage.universal.js

const {GlitterComponent} = require('../views/GlitterComponent');

const GlitterPage = {
    route: '/glitter',
    title: 'Glamorous Page',
    view: GlitterComponent,
};

module.exports = GlitterPage;
~~~

~~~js
// /example/views/GlitterComponent.js

import React from 'react';
import './GlitterStyle.css';
import './Tangerine.ttf';
import durl from './diamond.png';

const Center = ({children, style}) => (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', ...style
      }}
    >
        {children}
    </div>
);

const Diamond = () => <div className="diamond diamond-background"/>;

const GlitterComponent = () => (
    <Center style={{fontSize: '2em'}}>
        <Diamond/>
        I'm shiny
        <img className='diamond' src={durl}/>
    </Center>
);

export {GlitterComponent};
~~~

~~~css
// /example/views/GlitterStyle.css

body {
    background-color: pink;
    font-family: 'Tangerine', cursive;
}
.diamond-background {
    background-image: url('./diamond.png');
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
}

.diamond {
    width: 80px;
    height: 50px;
    margin: 25px;
    display: inline-block;
    vertical-align: middle;
}
~~~

Note how we load images

#### Async Data

~~~js
// /example/pages/GameOfThronesPage.html.js

const fetch = require('@brillout/fetch');
const {GameOfThronesComponent} = require('../views/GameOfThronesComponent');

module.exports = {
    route: '/game-of-thrones',
    title: 'Game of Thrones Characters',
    description: 'List of GoT Characters',
    view: GameOfThronesComponent,
    getInitialProps: async () => {
        const characters = await getGameOfThronesCharacters();
        return {characters};
    },
};

async function getGameOfThronesCharacters() {
    const urlBase = 'https://brillout-misc.github.io/game-of-thrones';
    const url = urlBase + '/characters/list.json';
    const characters = await (
        fetch(url)
        .then(response => response.json())
        .catch(err => {console.error(url); throw err})
    );
    return characters;
}
~~~

~~~js
// /example/views/GameOfThronesComponent.js

const React = require('react');

const GameOfThronesComponent = ({characters}) => (
    <div>
        <h3>Game of Thrones Characters</h3>
        <table border="7" cellPadding="5"><tbody>{
            characters.map(({name}) => (
                <tr key={name}><td>
                    {name}
                </td></tr>
            ))
        }</tbody></table>
    </div>
);

module.exports = {GameOfThronesComponent};
~~~

#### Production Environment

By default, Reframe compiles for developement.

By setting `process.env.NODE_ENV = 'production'` in Node.js or `export NODE_ENV='production'` on your Unix(-like) OS
you tell Reframe to compile for production.

When compiling for production,
the auto-reload feature is disabled,
the code is transpiled to support all browsers (instead of only the last 2 versions of Chrome and Firefox when compiling for dev),
the code is minifed,
the low-KB production build of React is used,
etc.

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
