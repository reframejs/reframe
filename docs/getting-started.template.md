!MENU
!MENU_ORDER 20

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
 - [Production](#production)


#### HTML-static & DOM-static

A hello world page definition:

~~~js
!INLINE ../example/pages/HelloWorldPage.html.js
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
!INLINE ../example/pages/DatePage.html.js
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
!INLINE ../example/pages/HelloPage.html.js
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
!INLINE ../example/pages/TimePage.universal.js
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
!INLINE ../example/pages/TrackingPage.html.js
~~~

~~~js
!INLINE ../example/pages/TrackingPage.entry.js
~~~


#### HTML-dynamic & partial DOM-dynamic

~~~js
!INLINE ../example/pages/NewsPage.html.js
~~~

~~~js
!INLINE ../example/pages/NewsPage.dom.js
~~~

#### CSS

~~~js
!INLINE ../example/pages/GlitterPage.universal.js
~~~

~~~js
!INLINE ../example/pages/GlitterComponent.js
~~~

~~~css
!INLINE ../example/pages/GlitterStyle.css
~~~

Note how we load images

#### Async Data

#### Production
