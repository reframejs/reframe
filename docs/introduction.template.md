[<p align="center"><img src='https://github.com/brillout-test/reprop-test/blob/master/docs/logo/logo-title.svg' width=400 style=    "max-width:100%;" alt="Reprop"/></p>](https://github.com/brillout/reprop)
<br/>

!MENU_TITLE Introduction
!MENU_ORDER 10
!MENU_LINK /../../
!MENU

Reframe is a library to render React components on the server, and/or in the browser, and/or statically.
With Reframe you can more easily create static and/or universal React apps.
Reframe has been designed with adaptability in mind.


Reframe allows you to define pages like this;

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

You can then serve the defined pages by running `reframe`;

~~~shell
$ reframe
✔ Page directory found at /home/brillout/code/@reframe/example/pages
✔ Frontend built at /home/brillout/code/@reframe/example/dist/
✔ Server running at http://localhost:3000
~~~

The CLI command `reframe` searches for the `pages` directory, builds the frontend (webpack), and spins up a server (Node.js/hapi).

Once the frontend is built and the server up the source code of `http://localhost:3000/hello` is;

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
        <div id="repage-renderer-react_container"><div>Hello World</div></div>
    </body>
</html>
~~~


With Reframe you can create pages that are;

 - **HTML-static**,
   <br/>
   where the page is rendered to HTML when building the frontend.
   <br/>
   (The HTML doesn't change. The HTML is rendered on "build-time".)
 - **HTML-dynamic**,
   <br/>
   where the page's HTML is rendered upon each HTTP request.
   <br/>
   (The HTML varies from request to request. The HTML is rendered on "request-time".)
 - **DOM-static**,
   <br/>
   where the page's DOM is not manipulated and React is only used to render HTML.
   <br/>
   (Reframe only uses `require('react-dom/server')`, `require('react-dom')` is not used and React doesn't manipulate the DOM.)
 - **DOM-dynamic**,
   <br/>
   where the page has React components that dynamically change in the browser.
   <br/>
   (Reframe uses `require('react-dom')` and React manipulates the DOM.)

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


Reframe is adaptable;

 - **Custom server.**
   <br/>
   You can use Reframe as a hapi plugin so that you can create the hapi server yourself to, for example, add database API endpoints.
   <br/>
   You can as well use any other server framework.
 - **Custom webpack configuration.**
   <br/>
   Reframe doesn't assume anything on the used webpack configuration.
   That way you use any webpack configuration you want.
 - **Custom CLI.**
   <br/>
   The `reframe` CLI is just a thin wrapper over `require('@reframe/core')`
   and you can use the NPM package directly instead of using the CLI.
   That way you can define your own bootup logic and process management.
 - **Customization all the way down to Repage.**
   <br/>
   Behind the curtain, Reframe is built on top of Repage, an agnostic low-level page management library.
   You can rewrite parts of Reframe to eventually get rid of Reframe altogether and depend on Repage only.
   You could for example use another build tool than webpack, use another view library than React, etc.
