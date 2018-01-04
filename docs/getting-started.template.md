!MENU
!MENU_ORDER 20

In this getting started
we start writing an HTML-static and DOM-static hello world example and we progresivelly change the example to make it HTML-dynamic and DOM-dynamic.

#### Installation

Throughout the documentation we will asume that
 - The CLI is installed; `npm install -g @reframe/cli`
 - React is i
 - The 

#### HTML-static & DOM-static

Let's create a static hello world page:

~~~js
!INLINE ../example/pages/HelloPage.html.js
~~~

Running the `reframe` CLI will spin up a Node.js/hapi server and serve our newly created hello world page:

~~~shell
$ reframe
✔ Page directory found at /home/alice/code/my-project/reframe-example/pages
✔ Frontend built at /home/alice/code/my-project/reframe-example/pages/dist/browser/
✔ Server running at http://localhost:3000
~~~

And the source code of the page as shown at view-source:http://localhost:3000/hello is:

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

Because of `htmlIsStatic: true` Reframe will build the HTML is static as it is generated on build-time
and since no JavaScript is loaded the DOM is static as well.

Now let's consider a more dynamic example where we display the current date.

#### HTML-dynamic & DOM-static

We display the current date and to make sure that the page's HTML is recreated everytime we hit the server we also display a timestamp showing when the page the HTLM has rendered.

~~~js
!INLINE ../example/pages/DatePage.html.js
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

Reloading the page 1 second later at 1:38 PM would lead to the same HTML but with `(Generated at 13:38:00)` instead of `(Generated at 13:37:00)`. The HTML is rerendered on every request.

This page's HTML is dynamic.
Since we still don't load any JavaScript the page's DOM is static.
Let's now use JavaScript to display the time where the DOM updates every second in order to always show the current time.

#### HTML-dynamic & DOM-dynamic

Note that all previous filenames endeded with `.html.js`: `HelloPage.html.js`, `DatePage.html.js`, and `TimePage.html.js`.

This time we save our page object in a filename ending with `.universal.js`: `TimePage.universal.js`.
This is how we tell Reframe to render the view on the browser. (Reframe will call `ReactDOM.hydrate()`.)

~~~js
!INLINE ../example/pages/TimePage.universal.js
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

This time we load JavaScript code and the DOM is updated every second to continuously show the current time.

When Reframe sees a `.universal.js` file in the `pages` directory it will then generate an entry point for the browser.
(
If you are curious,
you can see the entry point's source code at `~/code/@reframe/example/pages/dist/browser/source/TimePage.entry.js`)

But you can also create the browser entry point yourself.

#### Custom Browser Entry Point

~~~js
!INLINE ../example/pages/TimePage.entry.js
~~~

#### HTML-dynamic & partial DOM-dynamic


