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
[Introduction](/../../)<br/>
[Getting Started](/docs/getting-started.md)<br/>
[API](/docs/api.md)

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
// /example/pages/HelloPage.html.js

const React = require('react');

const HelloComponent = () => <div>Hello World</div>;

const HelloPage = {
    title: 'Hello there', // Page's title
    description: 'A Hello World page created with Reframe.',
    route: '/hello', // Page's URL
    view: HelloComponent,
    htmlIsStatic: true, // Let Reframe know that HelloPage's HTML is static.
};

module.exports = HelloPage;
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
        <div id="repage-renderer-react_container"><div>Hello World</div></div>
    </body>
</html>
~~~

Because of `htmlIsStatic: true` Reframe will build the HTML is static as it is generated on build-time
and since no JavaScript is loaded the DOM is static as well.

Now let's consider a more dynamic example where we display the current date.

#### HTML-dynamic & DOM-static

We display the current date and to make sure that the page's HTML is recreated everytime we hit the server we also display a timestamp showing when the page the HTLM has rendered.

~~~js
// /example/pages/DatePage.html.js

const React = require('react');

module.exports = {
    title: 'Current Date',
    route: '/date',
    view: () => {
        const now = new Date();
        return (
            <div>
                <div>Date: {now.toDateString()}</div>
                <small>(Page generated at {now.toTimeString()})</small>
            </div>
        );
    },
    htmlIsStatic: false, // This time, we let Reframe know that the HTML is not static
};
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
        <div id="repage-renderer-react_container"><div><div>Date: Mon Jan 01 2018</div><small>(Page generated at 13:37:00 GMT+0100 (CET))</small></div></div>
    </body>
</html>
~~~html

And reloading the page at 1 second later at 1:38 PM would lead to the same HTML with the exception that `Page generated at 13:37:00` is replaced with `Page generated at 13:38:00` showing that the HTML has been rerendered.

So this page's HTML is dynamic and its DOM is static as we still don't load any JavaScript.
Let's now use JavaScript to display the time and where the DOM updates every second in order to always show the current time.

#### HTML-dynamic & DOM-dynamic

Note that the file name ends with `TimePage.universal.js` whereas all previous filenames ended with `.html.js`.

~~~js
// /example/pages/TimePage.universal.js

const React = require('react');

class TimeComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {now: new Date()};
    }
    componentDidMount() {
        setInterval(
            () => this.setState({now: new Date()}),
            1000
        );
    }
    render() {
        return (
            <div>Time: {this.state.now.toTimeString()}</div>
        );
    }
}

module.exports = {
    title: 'Current Time',
    route: '/time',
    view: TimeComponent,
};
~~~

#### HTML-dynamic & partial DOM-dynamic

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
