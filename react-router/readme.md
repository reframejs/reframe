<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.






-->
Reframe + React Router v4 = :heart:

# `@reframe/react-router`

Use Reframe with React Router v4.

### Usage

Add `@reframe/react-router` to your `reframe.config` to use Reframe with React Router v4:

~~~js
// reframe.config

const reactRouter = require('@reframe/react-router'); // npm install @reframe/react-router

module.exports = {
    plugins: [
        reactRouter()
    ],
};
~~~

### Example

~~~js
// /react-router/example/reframe.config

const reactRouter = require('@reframe/react-router');

module.exports = {
    plugins: [
        reactRouter()
    ],
};
~~~

~~~js
// /react-router/example/pages/page.universal.js

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
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/react-router/readme.template.md` instead.






-->
