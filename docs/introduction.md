<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.






-->
[<p align="center"><img src='https://github.com/brillout-test/reprop-test/blob/master/docs/logo/logo-title.svg' width=400 style=    "max-width:100%;" alt="Reprop"/></p>](https://github.com/brillout/reprop)
<br/>

[Introduction](/../../)

Reframe is a library to render React pages on the server, and/or in the browser, and/or statically.
 Easily create static and/or universal React apps.


Reframe allows you to define pages like this;

~~~js
// /example/pages/HelloPage.html.js

const React = require('react');

const HelloComponent = () => <div>Hello World</div>;


const HelloPage = {
    title: 'Hello',
    route: '/hello',
    view: HelloComponent,
    htmlIsStatic: true,
};

module.exports = HelloPage;
~~~

Running the CLI command `reframe` will spin up a (Node.js/hapi) server.

~~~shell
$ reframe
✔ Page directory found at /home/romu/code/@reframe/example/pages
&#2713; Frontend built at /home/romu/code/@reframe/example/dist/
&#2713; Server running at http://localhost:3000
~~~

The source code of `http://localhost:3000/hello` will then be;

~~~html
<!DOCTYPE html>
<html>
    <head>
        <title>Hello</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta charset="utf-8">
    </head>
    <body>
        <div id="repage-renderer-react_container"><div>Hello World</div></div>
    </body>
</html>
~~~

With Reframe you can create different types of pages;

 - **HTML-static page**. The page's HTML is static and is rendered to HTML when building the frontend. The (on build-time rendered) HTML never changes.
 - **HTML-dynamic page**. The page's HTML is (re-)rendered upon each HTTP request. The (on request-time rendered) HTML varies from request to request.
 - **DOM-static page**. The page's DOM is not manipulated and React is only used to render HTML.
 - **DOM-dynamic page**. The page has React components that change in the browser. (I.e. `ReactDOM.hydrate()` is used.)

For example, you can create universal apps (i.e. apps that are rendered on both the server and the browser), static apps (i.e. apps where all pages are HTML-static), and a combination of both.

Reframe takes care of;

 - **Routing**. I.e. the mapping of URLs to a root React component.
 - **Server**. Reframe sets up a Node.js/hapi server to render your react pages to HTML. (You can also use Reframe with your own server.)
 - **Bundling**. Reframe builds your frontend assets for you. (We use webpack. You can use a fully custom webpack configuration.)

Reframe **doesn't** take care of;

 - State mangement. Use Redux, MobX, or Reprop instead.
 - Database. It's up to you to create, populate, and retrieve database(s). (You can use Reframe as a hapi plugin so that you can create the hapi server yourself to add database API endpoints.)

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.






-->
