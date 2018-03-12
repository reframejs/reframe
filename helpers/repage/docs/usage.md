<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.






-->
[Overview](/helpers/repage/readme.md)<br/>
[Usage](/helpers/repage/docs/usage.md)

# Usage

Repage's usage revolves around *page objects*. A page object is a JavaScript object that defines a page.

The most basic page object defines three properties:
`route` to determine the page's URL(s),
`renderToHtml` to render the page to HTML,
and `renderToDom` to render the page by manipulating the DOM.

The following is an example of defining a page over these three properties.

~~~js
// /helpers/repage/example/pages/about.js

const title = 'About Page';

const body = `
    About this about page;
    <ul>
        <li>No JavaScript executed.</li>
        <li>Custom &gt;head&lt;.</li>
    </ul>
`;

const html = `
    <html>
        <head>
            <title>${title}</title>
        </head>
        <body>
            ${body}
        </body>
    </html>
`;

module.exports = {
    route: '/about',
    renderToHtml: () => html,
    renderToDom: () => {
        document.title = title;
        document.body.innerHTML = body;
    },
    htmlStatic: true,
};
~~~

Note that we also set `htmlStatic: true` to tell Repage that the page is HTML-static.
Because the page is declared as HTML-static,
it will be included in the output of `getStaticPages()`.

We don't have to implement `renderToDom` and `renderToHtml` ourselves.
Instead, we can use a plugin that implements them for us.
For example,
by using the `@repage/renderer-react` plugin,
the page only needs to provide a React component to the page object
and the plugin implements the two render functions `renderToHtml` and `renderToDom`.
Let's look at a page defined like that.

~~~js
// /helpers/repage/example/pages/landing.js

const React = require('react');
const RepageRenderReact = require('@repage/renderer-react');

const el = React.createElement;

const LandingPresentation = () => (
    el('div', null,
        'Welcome',
        el('div', null,
            el('div', null,
                el('a', {href: '/hello/jon'}, 'Hello Page'),
            ),
            el('div', null,
                el('a', {href: '/about'}, 'About Page'),
            ),
        ),
    )
);

module.exports = {
    route: '/',
    title: 'Landing Page',
    view: LandingPresentation,
    htmlStatic: true,
    plugins: [
        RepageRenderReact,
    ],
};
~~~

Note how we add the `@repage/renderer-react` plugin by adding it to the page object's `plugins` array.
We can also add plugins globally as we will see in the next code snippet.

Now that we have defined some page objects, let's create a repage object and add our page objects to it.

~~~js
// /helpers/repage/example/common.js

const Repage = require('@repage/core');

// Repage pages
const AboutPage = require('./pages/about');
const HelloPage = require('./pages/hello');
const LandingPage = require('./pages/landing');

// Repage plugins
const RepageRender = require('@repage/renderer');
const RepageRouterCrossroads = require('@repage/router-crossroads');


const repage = new Repage();

repage.addPlugins([
    RepageRender,
    RepageRouterCrossroads,
]);

repage.addPages([
    AboutPage,
    HelloPage,
    LandingPage,
]);

module.exports = repage;
~~~

We have now created a repage object and added page objects and plugins to it.

Let's now render our pages.

Let's first look at static rendering.

~~~js
// /helpers/repage/example/build.js

process.on('unhandledRejection', err => {throw err});

const {getStaticPages} = require('@repage/build');

const repage = require('./common');

(async () => {
    const htmlStaticPages = await getStaticPages(repage);
    console.log(JSON.stringify(htmlStaticPages, null, 2));
})();
~~~

Running the code above prints

~~~js
[
  {
    "url": {
      "origin": null,
      "pathname": "/about",
      "search": "",
      "hash": ""
    },
    "html": "\n        <html>\n            <head>\n                <title>About Page</title>\n            </head>\n            <body>\n                \n    About this about page;\n    <ul>\n        <li>no JS executed</li>\n        <li>custom container incl. custom &gt;head&lt;</li>\n    </ul>\n\n            </body>\n        </html>\n    "
  },
  {
    "url": {
      "origin": null,
      "pathname": "/",
      "search": "",
      "hash": ""
    },
    "html": "<!DOCTYPE html>\n<html>\n    <head>\n        <title>Landing Page</title>\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n        <meta charset=\"utf-8\">\n    </head>\n    <body>\n        <div id=\"react-root\"><div>Welcome<div><div><a href=\"/hello/jon\">Hello Page</a></div><div><a href=\"/about\">About Page</a></div><div><a href=\"http://example.org/\">External Page</a></div></div></div></div>\n    </body>\n</html>"
  }
]
~~~

`getStaticPages(repage)` can be used in a build process to add HTML files to the static assets directory.
Each HTML file is generated from a HTML-static page.
(HTML-static pages can be rendered to HTML on build-time.)
This is the canonical way to render HTML-static pages.

You can run the code above yourself:

~~~shell
sudo npm i -g yarn && mkdir -p ~/tmp && cd ~/tmp && git clone https://github.com/brillout/repage.git && cd repage && npm i && ./node_modules/.bin/lerna bootstrap
~~~
~~~shell
node ~/tmp/repage/example/build
~~~


Let's now look at browser-side rendering.

~~~js
// /helpers/repage/example/browser/main.js

const {hydratePage} = require('@repage/browser');
const RepageNavigator = require('@repage/navigator/browser');

const LandingPage = require('../pages/landing');

const repage = require('../common');
repage.addPlugins([
    RepageNavigator,
]);

hydratePage(repage, LandingPage);
~~~

`hydratePage(repage)` can be used to add DOM event listeners for DOM-dynamic pages.

You can run the code above yourself:

~~~shell
sudo npm i -g yarn && mkdir -p ~/tmp && cd ~/tmp && git clone https://github.com/brillout/repage.git && cd repage && npm i && ./node_modules/.bin/lerna bootstrap
~~~
~~~shell
node ~/tmp/repage/example/browser
~~~

Let's now look at server-side rendering.

Running

~~~js
// /helpers/repage/example/server.js

process.on('unhandledRejection', err => {throw err});

const {getPageHtml} = require('@repage/server');

const repage = require('./common');

const incomingRequestsSimulation = [
    {req: {pathname: '/hello/jon'}},
];

(async () => {
    incomingRequestsSimulation.forEach(async ({req: {pathname}}) => {
        const pageHtml = await getPageHtml(repage, pathname);
        console.log(JSON.stringify(pageHtml, null, 2));
    });
})();
~~~

prints

~~~js
{
  "html": "<!DOCTYPE html>\n<html>\n    <head>\n        <title>Hello Page</title>\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1\">\n        <meta charset=\"utf-8\">\n    </head>\n    <body>\n        <div id=\"react-root\"><div><div>hello jon</div><h3>Game of Thrones Characters</h3><table border=\"7\" cellPadding=\"5\"><tbody><tr><td>Jon Snow</td></tr><tr><td>Daenerys Targaryen</td></tr><tr><td>Cersei Lannister</td></tr><tr><td>Tyrion Lannister</td></tr><tr><td>Sansa Stark</td></tr></tbody></table></div></div>\n    </body>\n</html>",
  "renderToHtmlIsMissing": false
}
~~~

`getPageHtml(repgae, uri)` can be called upon HTTP requests in order to return the HTML of the page matching the request's `uri`.
This is the canonical way to render HTML-dynamic pages.

You can run the code above yourself:

~~~shell
sudo npm i -g yarn && mkdir -p ~/tmp && cd ~/tmp && git clone https://github.com/brillout/repage.git && cd repage && npm i && ./node_modules/.bin/lerna bootstrap
~~~
~~~shell
node ~/tmp/repage/example/server
~~~


Finally, let's look at a page object with a parametrized route and with async initial data loading.

~~~js
// /helpers/repage/example/pages/hello.js

const React = require('react');
const RepageRenderReact = require('@repage/renderer-react');

const el = React.createElement;

const HelloPresentation = props => (
    el('div', {},
        el('div', {},
            'hello '+props.route.args.name
        ),
        el('h3', {},
            'Game of Thrones Characters',
        ),
        el('table', {border: 7, cellPadding: 5}, el('tbody', {},
            // `props.characters` comes from `getInitialProps`
            props.characters.map(({name}) => (
                el('tr', {key: name}, el('td', {}, name))
            ))
        ))
    )
);

module.exports = {
    route: '/hello/{name}',
    title: 'Hello Page',
    view: HelloPresentation,
    getInitialProps,
    htmlStatic: false, // This page is not HTML-static because of the route parameter `name`
    plugins: [
        RepageRenderReact,
    ],
};

async function getInitialProps() {
    const {characters} = await loadData();
    return {characters};
}

function loadData() {
    const DATA = {
        characters: [
            {name: 'Jon Snow'},
            {name: 'Daenerys Targaryen'},
            {name: 'Cersei Lannister'},
            {name: 'Tyrion Lannister'},
            {name: 'Sansa Stark'},
        ],
    };

    const DELAY = 1000;

    return delay(DATA, DELAY);

    function delay(data) {
        return (
            new Promise(resolve => {
                setTimeout(() => {
                    resolve(data);
                }, DELAY);
            })
        );
    }
}
~~~

The `@repage/renderer-react` renderer plugin waits until `getInitialProps()` asynchronously resolves.
The plugin then creates a React element and passes the `getInitialProps()` resolved value as the element's props.
Finally, the plugin renders the React element.


If you are left with question(s), feel free to open a GitHub issue.
Also note that every package is <200 LOC, so reading the source code could be a viable option.

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/repage/docs/usage.template.md` instead.






-->
