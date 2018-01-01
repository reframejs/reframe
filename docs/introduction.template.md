[<p align="center"><img src='https://github.com/brillout-test/reprop-test/blob/master/docs/logo/logo-title.svg' width=400 style=    "max-width:100%;" alt="Reprop"/></p>](https://github.com/brillout/reprop)
<br/>

!MENU_TITLE Introduction
!MENU_ORDER 10
!MENU_LINK /../../
!MENU

Reframe is a library to render React components on the server, and/or in the browser, and/or statically.
With Reframe you can easily create static and/or universal React apps.


Reframe allows you to define pages like this;

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Running the CLI command `reframe` will build the frontend (webpack) and spin up a server (Node.js/hapi).

~~~shell
$ reframe
✔ Page directory found at /home/brillout/code/@reframe/example/pages
✔ Frontend built at /home/brillout/code/@reframe/example/dist/
✔ Server running at http://localhost:3000
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

With Reframe you can create pages that are;

 - **HTML-static**,
   <br/>
   where the page's HTML is static and is rendered to HTML when building the frontend.
   The HTML never changes.
   The HTML is rendered on "build-time".
 - **HTML-dynamic**,
   <br/>
   where the page's HTML is (re-)rendered upon each HTTP request.
   The HTML varies from request to request.
   The HTML is rendered on "request-time".
 - **DOM-static**,
   <br/>
   where the page's DOM is not manipulated and React is only used to render HTML.
   Reframe only uses `require('react-dom/server')`, `require('react-dom')` is not used and React doesn't manipulate the DOM.
   .
 - **DOM-dynamic**,
   <br/>
   where the page has React components that dynamically change in the browser.
   Reframe uses `require('react-dom')` and React manipulates the DOM.

For example, you can create universal apps (i.e. apps that are rendered on both the server and the browser), static apps (i.e. apps where all pages are HTML-static), or a combination of both.

Reframe takes care of;

 - **Routing**.
   <br/>
   I.e. the mapping of a URL to a React component.
 - **Server**.
   <br/>
   Reframe sets up a Node.js/hapi server to render your react pages to HTML. (You can also use Reframe with your own server.)
 - **Build**.
   <br/>
   Reframe builds and bundles your frontend assets for you. (Reframe uses webpack. You can use a fully custom webpack configuration.)

Reframe **doesn't** take care of;

 - State management.
   <br/>
   Manage the state of your app yourself or use Redux / MobX / Reprop.
 - Database.
   <br/>
   It's up to you to create, populate, and retrieve databases.
   <br/>
   You can use Reframe as a hapi plugin so that you can create the hapi server yourself to add database API endpoints.
