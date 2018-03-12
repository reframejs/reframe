!MENU

# Usage

Repage's usage revolves around *page objects*. A page object is a JavaScript object that defines a page.

The most basic page object defines three properties:
`route` to determine the page's URL(s),
`renderToHtml` to render the page to HTML,
and `renderToDom` to render the page by manipulating the DOM.

The following is an example of defining a page over these three properties.

~~~js
!INLINE ../example/pages/about.js
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
!INLINE ../example/pages/landing.js
~~~

Note how we add the `@repage/renderer-react` plugin by adding it to the page object's `plugins` array.
We can also add plugins globally as we will see in the next code snippet.

Now that we have defined some page objects, let's create a repage object and add our page objects to it.

~~~js
!INLINE ../example/common.js
~~~

We have now created a repage object and added page objects and plugins to it.

Let's now render our pages.

Let's first look at static rendering.

~~~js
!INLINE ../example/build.js
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
!INLINE ../example/browser/main.js
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
!INLINE ../example/server.js
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
!INLINE ../example/pages/hello.js
~~~

The `@repage/renderer-react` renderer plugin waits until `getInitialProps()` asynchronously resolves.
The plugin then creates a React element and passes the `getInitialProps()` resolved value as the element's props.
Finally, the plugin renders the React element.


If you are left with question(s), feel free to open a GitHub issue.
Also note that every package is <200 LOC, so reading the source code could be a viable option.
