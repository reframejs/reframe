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
<div><p align="right"><sup>
    <a href="#">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/star.svg?sanitize=true"
          width="15"
          height="13"
        >
    </a>
    Star if you like
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://twitter.com/reframejs">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/twitter-logo.svg?sanitize=true"
          width="15"
          height="13"
        >
        Follow on Twitter
    </a>
    &nbsp;&nbsp;&nbsp;&nbsp;
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    <a href="https://discord.gg/kqXf65G">
        <img
          src="https://github.com/reframejs/reframe/raw/master/docs/images/online-icon.svg?sanitize=true"
          width="14"
          height="10"
        >
        Chat on Discord
    </a>
</sup></p></div>

[<p align="center"><img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/></p>](https://github.com/reframejs/reframe)

<div><p align="center">
        Framework to create web apps with React.
</p></div>

<div><p align="center">
    <b>Easy</b>
    -
    Create apps with page configs.
    &nbsp;&nbsp;&nbsp;
    <b>Universal</b>
    -
    Create any type of app.
    &nbsp;&nbsp;&nbsp;
    <b>Escapable</b>
    -
    Easy & progressive escape.
</p></div>

<br/>

[Overview](/../../)<br/>
[Reframe Rationale](/docs/reframe-rationale.md)<br/>
[**Usage Manual**](/docs/usage-manual.md)<br/>
[Customization Manual](/docs/customization-manual.md)<br/>
[Plugins](/docs/plugins.md)

<br/>

# Usage Manual

The usage manual acts as reference for using Reframe wihtout advanced customization.
This manual covers most common use cases.

#### Contents

###### Basic Usage

 - [Getting Started](#getting-started)
 - [Static Pages VS Dynamic Pages](#static-pages-vs-dynamic-pages)
 - [CSS & Static Assets](#css--static-assets)
 - [Async Data](#async-data)
 - [Links & Page Navigation](#links--page-navigation)
 - [Production Environment](#production-environment)

###### Further Usage

 - [Custom Server](#custom-server)
 - [Custom Head](#custom-head)
 - [404 Page](#404-page)
 - [Advanced Routing](#advanced-routing)
 - [Custom Browser JavaScript](#custom-browser-javascript)
 - [Related External Docs](#related-external-docs)



## Getting Started

Let's create a React app with Reframe.

1. We create a `pages/` directory:

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~

2. We create a new JavaScript file at `~/tmp/reframe-playground/pages/HelloPage.js` that exports a page config:

~~~jsx
import React from 'react';

const HelloPage = {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
        </div>
    ),
};

export default HelloPage;
~~~

3. We install React and the Reframe CLI:

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
npm install react
~~~

4. Finally, we run the CLI:

~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
reframe
~~~

which prints

~~~shell
$ reframe
✔ Page directory found at ~/tmp/reframe-playground/pages
✔ Code built at ~/tmp/reframe-playground/dist/ [DEV]
✔ Server running at http://localhost:3000
~~~

Our page is now live at [http://localhost:3000](http://localhost:3000).

That's it: We have created a web app by simply creating one React Component and one page config.



## Static Pages VS Dynamic Pages

A fundamental aspect of the page config is that it allows you to configure a page to be "HTML-static" or "HTML-dynamic" and "DOM-static" or "DOM-dynamic":
 - *HTML-static*
   <br/>
   The page is rendered to HTML at build-time.
   <br/>
   (In other words, the page is rendered to HTML only once, when Reframe is building the frontend.)
 - *HTML-dynamic*
   <br/>
   The page is rendered to HTML at request-time.
   <br/>
   (In other words, the page is (re-)rendered to HTML every time the user requests the page.)
 - *DOM-static*
   <br/>
   The page is not hydrated.
   <br/>
   (In other words, the DOM doesn't have any React component attached to it and the DOM will not change.)
 - *DOM-dynamic*
   <br/>
   The page is hydrated.
   <br/>
   (In other words, React components are attached to the DOM and the page's DOM will eventually be updated by React.)

By default, a page is HTML-dynamic and DOM-dynamic.
A page is made HTML-static by setting `htmlStatic: true` in its page config,
And by setting `domStatic: true`, the page is made DOM-static.

For example:

~~~js
// /pages/TimePage.js

import TimeComponent from '../views/TimeComponent';

export default {
    route: '/',
    view: TimeComponent,
    htmlStatic: true,
    domStatic: true,
};
~~~

~~~jsx
// /views/TimeComponent

import React from 'react';

class TimeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {time: this.getTime()};
    }
    componentDidMount() {
        setInterval(() => this.setState({time: this.getTime()}), 1000);
    }
    getTime() {
        const now = new Date();
        const time = (
            [now.getHours(), now.getMinutes(), now.getSeconds()]
            .map(d => d<=9 ? '0'+d : d)
            .join(':')
        );
        return time;
    }
    render() {
        return <span>{this.state.time}</span>;
    }
}

export default TimeComponent;
~~~

The page will always display the same time, namely the time when the page's HTML was generated at build-time.
That's because `htmlStatic: true` makes Reframe generate the HTML at build-time (instead of request-time).
And also because `domStatic: true` makes Reframe not hydrate the page, in other words, `TimeComponent` is not attached to the DOM, it is not loaded in the browser, and it is only used to generate the page's HTML.

Removing `htmlStatic: true` makes Reframe generate the HTML at request-time, and the page then shows the current time whenever the page (re-)loads.

Removing `domStatic: true` makes Reframe hydrate the page, and the page's DOM is updated every second to always show the current time.

DOM-static pages are considerably more performant as the browser doesn't have to load nor render the page's React components.

And HTML-static pages are more performant as the HTML is rendered only once at build-time instead of being re-rendered on every request.

If all pages are HTML-static,
then all HTMLs are rendered at build-time,
no server code is required,
and the app can be deployed to a static website host
such as [GitHub Pages](https://pages.github.com/) or Netlify.

Also,
keep in mind that interactive views are inherently and considerably more complex than static views.
It is recommended to implement app requirements with static views whenever possible,
and to implement interactive views only when necessary.
Reframe embraces that recommandation by allowing you to write web apps where a majority of the pages are DOM-static.

## CSS & Static Assets

A CSS file can be loaded and applied by importing it.

~~~js
import './GlitterStyle.css';
~~~

Static assets (images, fonts, videos, etc.) can be imported as well
but importing an asset doesn't actually load it:
Only the URL of the asset is returned.
It is up to us to use/fetch the URL of the asset.

~~~js
import diamondUrl from './diamond.png';

// do something with diamondUrl, e.g. `await fetch(diamondUrl)` or `<img src={diamondUrl}/>`
~~~

In addition, static assets can be referenced in CSS files by using the CSS `url` data type.

~~~css
.diamond-background {
    background-image: url('./diamond.png');
}
~~~

The following shows code using CSS and static assets as described above.

~~~js
// /examples/basics/pages/GlitterPage.js

const {GlitterComponent} = require('../views/GlitterComponent');

const GlitterPage = {
    route: '/glitter',
    title: 'Glamorous Page',
    view: GlitterComponent,
    domStatic: true,
};

module.exports = GlitterPage;
~~~

~~~js
// /examples/basics/views/GlitterComponent.js

import React from 'react';
import './GlitterStyle.css';
import diamondUrl from './diamond.png';

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
        Shine
        <img className='diamond' src={diamondUrl}/>
    </Center>
);

export {GlitterComponent};
~~~

~~~css
// /examples/basics/views/GlitterStyle.css

body {
    background-color: pink;
    font-family: 'Tangerine';
    font-size: 2em;
}
.diamond-background {
    background-image: url('./diamond.png');
    background-repeat: no-repeat;
    background-size: contain;
}

.diamond {
    width: 80px;
    height: 47px;
    margin: 25px;
    display: inline-block;
}

@font-face {
    font-family: 'Tangerine';
    src: url('./Tangerine.ttf') format('truetype');
}
~~~

Note that CSS and static assets are handled by webpack,
and that the webpack config is fully customizable.
We referer to the Customization Manual for further information.

Also note that all types of static assets are supported.



## Async Data

A common React use case is to display data that is fetched over the network.
The page config supports a `async getInitialProps()` property that Reframe calls every time and before the view is rendered.
(On both the server and in the browser.)
We can therefore use `async getInitialProps()` to fetch the data that page's React components require.

For example:

~~~js
// /examples/basics/pages/GameOfThronesPage.js

import React from 'react';
import {CharacterNames, getCharacters} from '../views/GameOfThrones';

export default {
    route: '/game-of-thrones',
    title: 'Game of Thrones Characters',
    description: 'List of GoT Characters',
    view: props => (
        <CharacterNames
          names={props.characters.map(character => character.name)}
        />
    ),
    // Everything returned in `getInitialProps()` is be passed to the props of the view
    getInitialProps: async () => {
        const characters = await getCharacters();
        return {characters};
    },
    domStatic: true,
};
~~~

~~~js
// /examples/basics/views/GameOfThrones.js

import React from 'react';
import fetch from '@brillout/fetch';

const CharacterNames = props => (
    <div>
        <h3>Game of Thrones Characters</h3>
        <table border="7" cellPadding="5">
            <tbody>{
                props.names.map(name => (
                    <tr key={name}><td>
                        {name}
                    </td></tr>
                ))
            }</tbody>
        </table>
    </div>
);

async function getCharacters() {
    const urlBase = 'https://brillout-misc.github.io/game-of-thrones';
    const url = urlBase + '/characters/list.json';
    const characters = await (
        fetch(url)
        .then(response => response.json())
        .catch(err => {console.error(url); throw err})
    );
    return characters;
}

export {CharacterNames};
export {getCharacters};
~~~

Because `aysnc getInitialProps()` is called and waited for prior to rendering the HTML, our page's HTML `view-source:http://localhost:3000/game-of-thrones` displays the data already.

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Game of Thrones Characters</title>
        <meta name="description" content="List of GoT Characters">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div><h3>Game of Thrones Characters</h3><table border="7" cellPadding="5"><tbody><tr><td>Daenerys Targaryen</td></tr><tr><td>Jon Snow</td></tr><tr><td>Cersei Lannister</td></tr><tr><td>Petyr Baelish</td></tr><tr><td>Bran Stark</td></tr><tr><td>Tyrion Lannister</td></tr><tr><td>Varys</td></tr><tr><td>Tormund</td></tr><tr><td>Samwell Tarly</td></tr></tbody></table></div></div>
    </body>
</html>
~~~

Alternatively, we can fetch data in a statefull component.

~~~js
// /examples/basics/pages/GameOfThrones2Page.js

import React from 'react';
import {CharacterNames, getCharacters} from '../views/GameOfThrones';

class Characters extends React.Component {
    render() {
        if( ! this.state || ! this.state.names ) {
            return <div>Loading...</div>;
        }
        return <CharacterNames names={this.state.names}/>;
    }
    async componentDidMount() {
        const names = (
            (await getCharacters())
            .map(character => character.name)
        );
        this.setState({names});
    }
}

export default {
    route: '/game-of-thrones-2',
    view: Characters,
};
~~~

Note that,
when using such statefull component,
the server renders the HTML before the data is loaded.
In our case,
 this means that the HTML `view-source:http://localhost:3000/game-of-thrones-2`
displays the loading state `<div id="react-root"><div>Loading...</div></div>`.
And the HTML returned by the server is:

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="react-root"><div>Loading...</div></div>
        <script src="/commons.hash_451146e5dbcfe0b09f80.js" type="text/javascript"></script>
        <script src="/GameOfThrones2Page.entry.hash_2c79748d10c1e953f159.js" type="text/javascript"></script>
    </body>
</html>
~~~



## Links & Page Navigation

The basic way to navigate between pages is to use link tags such as `<a href="/about">About</a>`.

See [Advanced Routing](#advanced-routing) for alternative ways of navigating.

An example of basic page navigation:

~~~js
// /examples/basics/pages/page-a.js

import React from 'react';

const pageA = {
    route: '/page-a',
    view: () => <div>This is page A. <a href='/page-b'>Link to page B</a>.</div>,
    domStatic: true,
};

export default pageA;
~~~
~~~js
// /examples/basics/pages/page-b.js

import React from 'react';

const pageB = {
    route: '/page-b',
    view: () => <div>This is page B. <a href='/page-a'>Link to page A</a>.</div>,
    domStatic: true,
};

export default pageB;
~~~



## Production Environment

By default, Reframe compiles for development.

We can tell Reframe to compile for production by
 - setting `process.env.NODE_ENV = 'production';` in Node.js, or by
 - setting `export NODE_ENV='production'` in a Unix(-like) OS, or by
 - running `reframe --prod` in the shell

When compiling for production,
the auto-reload feature is disabled,
the code is transpiled to support all browsers (only the last 2 versions of Chrome and Firefox are targeted when compiling for dev),
the code is minifed,
the low-KB production version of React is used,
etc.

The Reframe CLI displays a `[PROD]` notification when compiling for production:

~~~shell
$ reframe --prod
✔ Page directory found at ~/tmp/reframe/example/pages/
✔ Frontend built at ~/tmp/reframe/example/dist/browser/ [PROD]
✔ Server running at http://localhost:3000
~~~



## Custom Server

Instead of using the CLI, Reframe can be used as hapi plugin(s), as shown in the next example.

~~~js
// /examples/custom/server/hapi-server.js

const Hapi = require('hapi');
const getHapiPlugins = require('@reframe/server/getHapiPlugins');
const path = require('path');

(async () => {
    const server = Hapi.Server({port: 3000});

    const {HapiPluginReframe} = (
        await getHapiPlugins({
            pagesDirPath: path.resolve(__dirname, '../../basics/pages'),
        })
    );

    await server.register([
        {plugin: HapiPluginReframe},
    ]);

    server.route({
        method: 'GET',
        path:'/custom-route',
        handler: function (request, h) {
            return 'This is a custom route. This could for example be an API endpoint.'
        }
    });

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
})();
~~~

That way, we can create the hapi server ourselves, add routes to it, and configure it as we wish.

Reframe's server is fully customaziable, and
can be used with another server framework such as Express.
The Customization Manual elaborates on such possibilities.



## Custom Head

Reframe handles the outer part of HTML (including `<head>`, `<!DOCTYPE html`>, `<script>`, etc.) with `@brillout/html-crust`.

All options of `@brillout/html-crust` are available over the page config.
Thus, the page config has full control over the outer part of HTML including the `<head>`.

We refer to [`@brillout/html-crust`'s documentation](https://github.com/brillout/html-crust) for further information.

For example, the page config

~~~js
// /examples/basics/pages/custom-html.js

import React from 'react';

export default {
    route: '/custom-html',
    headHtml: '<title>Full custom head</title>',
    bodyHtml: '<div>Full custom body</div>',
    domStatic: true,
};
~~~

creates a page with following HTML

~~~js
<!DOCTYPE html>
<html>
  <head>
    <title>Full custom head</title>
  </head>
  <body>
    <div>Full custom body</div>
  </body>
</html>
~~~



## 404 Page

A 404 page can be implement by using a catch-all route:

~~~js
import React from 'react';

export default {
    route: '/:params*',
    title: 'Not Found',
    view: props => (
        <div>
            The page {props.route.url.pathname} does not seem to exist.
        </div>
    ),
};
~~~



## Advanced Routing

###### Reframe's default router

By default, Reframe uses [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp) to match URLs with a route.
(React Router uses `path-to-regexp` as well.)

For example, in the following page config, Reframe will use `path-to-regexp` to determine if a URL matches the page's route `'/hello/:name'`.

~~~jsx
const HelloPage = {
    route: '/hello/:name',
    view: ({route: {args: {name}}}) => <div>Welcome {name}</div>,
};
~~~

See [`path-to-regexp`'s docs](https://github.com/pillarjs/path-to-regexp) for further information about the route string syntax.

###### React Router

You can use React Router's components by adding the plugin [`@reframe/react-router`](/react-router).

Using React Router components allow you to implement:
 - **pushState-navigation**
   <br/>
   What "pushState-navigation" means is explained below.
 - **Nested Routes**
   <br/>
   For pages that differ in only some parts, in other words, where the majority of the view is the same.
 - **SPAs**
   <br/>
   Apps where the app's entire browser-side code is bundled in one script and loaded at once.
 - **URL hash**
   <br/>
   URLs with a `window.location.hash`.

###### Html-navigation VS pushState-navigation

There are two ways of navigating between pages:
 - *HTML-navigation*
   <br/>
   When clicking a link, the new page's HTML is loaded.
   (In other words, the browser discards the current DOM and builds a new DOM upon the new page's HTML.)
 - *pushState-navigation*
   <br/>
   When clicking a link, the URL is changed by `history.pushState()` and the DOM is manipulated (instead of loading the new page's HTML).

By default, Reframe does HTML-navigation when using `<a>` links between pages defined with page configs.

###### pushState-navigation

By using React Router's components you can do pushState-navigation.
Pages are then defined by React Router's component instead of page configs.

Note that with *page* we denote any view that is identified with a URL:
If two URLs have similar views that differ in only in a small way,
we still speak of two pages because these two views have two different URLs.

Also note that the broswer-side code is splitted only between pages defined with page configs,
and pages defined with React Router components will share the same browser-side code bundle.

###### Custom router

Reframe can be used with any routing library.

It can, for example, be used with [Crossroads.js](https://github.com/millermedeiros/crossroads.js).

We refer to the source code of the plugin [`@reframe/crossroads`](/crossroads) for further information about how to use Reframe with another routing library.


## Custom Browser JavaScript

If our page is saved as `pages/MyPage.html.js` and, if we save a JavaScript file as `pages/MyPage.entry.js`, then Reframe will take `pages/MyPage.entry.js` as browser entry point.
See the Customization Manual for further information.

We can as well add arbitrary script tags to the page's HTML (external scripts, async scripts, etc.).
See the "Custom Head" section.



## Related External Docs

The following packages are used by Reframe.
 - [Repage](https://github.com/reframejs/reframe/tree/master/helpers/repage) - Low-level and unopinionted page management library.
 - [@brillout/html-crust](https://github.com/brillout/html-crust) - HTML outer part handler. (`<head>`, `<!DOCTYPE html>`, `<script>`, etc.)
 - [@brillout/find](https://github.com/brillout/find) - Package to find files. The Reframe CLI uses it to find the `pages/` directory.
 - [Rebuild](https://github.com/reframejs/reframe/tree/master/helpers/rebuild) - High-level asset bundling tool build on top of the low-level tool webpack.


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
