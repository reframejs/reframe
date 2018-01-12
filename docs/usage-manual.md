<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.






-->
[Overview](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)

This getting started explains how to create *page objects* for
HTML-static, HTML-dynamic, DOM-static, and DOM-dynamic pages.

# Usage Manual

Reframe revolves around *page objects* wich are JavaScript objects that define pages.

#### Contents

 - [Getting Started](#getting-started)
 - [HTML-static VS HTML-dynamic](#html-static-vs-html-dynamic)
 - [DOM-static VS DOM-dynamic](#dom-static-vs-dom-dynamic)
 - [Partial DOM-dynamic](#html-dynamic-partial-dom-dynamic)
 - [CSS](#css)
 - [Async Data](#async-data)
 - [Links & Page Navigation](#links)
 - [Production Environment](#production-environment)

#### Getting Started

Let's start by writing and running a hello world page.

We now create our pages directory

~~~shell
mkdir -p /tmp/reframe-playground/pages
~~~

and we create a new file `/tmp/reframe-playground/pages/HelloPage.html.js` with following content

~~~js
import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
        </div>
    ),
};
~~~



We will use the reframe CLI and we need React, so let's install these two

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd /tmp/reframe-playground/ && npm install react
~~~

By running

~~~shell
reframe /tmp/reframe-playground/pages
~~~

~~~shell
✔ Frontend built at /tmp/reframe-playground/dist/browser/
✔ Server running at http://localhost:3000
~~~

a server is spin up and our page is now available at http://localhost:3000.

An the HTML code view-source:http://localhost:3000/ is

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Hello World, from Reframe.</div></div>
    </body>
</html>
~~~

The page doesn't load any JavaScript and the DOM is static as there isn't any JavaScript to manipulate the DOM.
We say that the page is *DOM-static*.
You can also create pages with dynamic React components and we will see in a bit how.

Also note that our page is "HTML-dynamic" and we will now discuss what this means.


#### HTML-static vs HTML-dynamic

Let's consider the Hello World page of our previous section.
When is its HTML generated?
To get an answer we add a timestamp to our page and
modify `/tmp/reframe-playground/pages/HelloPage.html.js` to

~~~js
import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
            <br/>
            (Generated at {new Date().toLocaleTimeString()}.)
        </div>
    ),
};
~~~

If you haven't already, let's run a Reframe server

~~~shell
reframe /tmp/reframe-playground/pages
~~~

and the sell should print

~~~shell
$ reframe
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
~~~

If you haven't closed the server the CLI created in the previous section then 
Before we go on
If you were already running a Reframe, then Reframe automatically re-compiled the JavaScript and added a `✔ Re-build` notification in your shell

~~~shell
$ reframe
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
✔ Re-build
~~~

Let's use our timestamp to see when the HTML is created.

Reload the page and if the time is 13:37:00 then view-source:http://localhost:3000/hello is

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Hello from Reframe.<br/>(Generated at 13:37:00)</div></div>
    </body>
</html>
~~~

If we reload one second later at 13:37:01 we would get the same HTML except that
`(Generated at 13:37:00)` is now replaced with `(Generated at 13:37:01)`.
This means that everytime we load the page the HTML is re-rendered.
The HTML is generated at request-time and we say that this page is *HTML-dynamic*.

Now, the HTML of our hello world doesn't really need to be dynamic, so let's make it static.

For that we change our page object defined at `/tmp/reframe-playground/pages/HelloPage.html.js` to

~~~js
import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
            <br/>
            (Generated at {new Date().toLocaleTimeString()}.)
        </div>
    ),
	htmlIsStatic: true,
};
~~~

Setting `htmlIsStatic: true`
tells Reframe that the HTML is static and
Reframe creates the HTML at build-time.
You can actually see the static HTML on your filesystem at `/tmp/reframe-playground/dist/browser/index.html`.
If the time when building was `12:00:00` then our timestamp will always be `(Generated at 12:00:00)`, no matter when we load our page.

For pages with lot's of elements, generating the HTML at build-time instead of request-time is a considerable performance gain.
Also, if all yours pages are HTML-static, then you can deploy your app to any static website host such as GitHub Pages.

Before we move on to dynamic DOMs, let's look at another HTML-dynamic page

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

Not only is this page HTML-dynamic but it actually has to.
That is because the route `/hello/{name}` of `HelloPage.html.js` is parameterized; There is an infinite number of pages with URLs matching the route such as `/hello/Alice-1`, `/hello/Alice-2`, `/hello/Alice-3`, etc. We can't compute an infinite number of pages at build-time and the page has to be HTML-dyanmic.

All pages that have a parameterized route are HTML-dynamic.

Let's now create pages that have dynamic views.



#### DOM-static VS DOM-dynamic

Let's create a page that display the current time.


We create a page that loads JavaScript code that updates the time every second by manipulating the DOM with React.

`/tmp/reframe-playground/pages/HelloPage.html.js`

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

#### Links



#### Production Environment

By default, Reframe compiles for development.

By setting `process.env.NODE_ENV = 'production';` in Node.js or `export NODE_ENV='production'` on your Unix(-like) OS
you tell Reframe to compile for production.

When compiling for production,
the auto-reload feature is disabled,
the code is transpiled to support all browsers (instead of only the last 2 versions of Chrome and Firefox when compiling for dev),
the code is minifed,
the low-KB production build of React is used,
etc.


### Related Docs Reference




<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/usage-manual.template.md` instead.






-->
