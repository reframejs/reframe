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
