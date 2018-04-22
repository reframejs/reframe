Let's create a React app with Reframe.

1. We create a `pages/` directory:

~~~shell
$ mkdir -p ~/tmp/reframe-playground/pages
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
$ npm install -g @reframe/cli
$ cd ~/tmp/reframe-playground/
$ npm install react
~~~

4. Finally, we run the CLI:

~~~shell
$ reframe
✔ Page directory found at ~/tmp/reframe-playground/pages
✔ Code built at ~/tmp/reframe-playground/dist/ [DEV]
✔ Server running at http://localhost:3000
~~~

Our page is now live at [http://localhost:3000](http://localhost:3000).

That's it: We have created a web app by simply creating one React Component and one page config.
