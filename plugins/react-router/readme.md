<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.






-->
Reframe + React Router v4 = :heart:

# `@reframe/react-router`

Use React Router's components.

### Usage

Add `@reframe/react-router` to your `reframe.config.js`:

~~~js
// reframe.config.js

const reactRouter = require('@reframe/react-router'); // npm install @reframe/react-router

module.exports = {
    plugins: [
        reactRouter()
    ],
};
~~~

### Example

~~~js
// /plugins/react-router/example/reframe.config.js

const reactRouter = require('@reframe/react-router');

module.exports = {
    plugins: [
        reactRouter()
    ],
};
~~~

~~~js
// /plugins/react-router/example/pages/spa-page.config.js

import React from 'react';
import {Link, Route} from "react-router-dom";

const App = () => (
  <div>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
    </ul>
    <hr />
    <Route exact path="/" component={Home} />
    <Route path="/about" component={About} />
  </div>
);

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const pageConfig = {
  route: '/:params*',
  view: App,
};

export default pageConfig;
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/react-router/readme.template.md` instead.






-->
