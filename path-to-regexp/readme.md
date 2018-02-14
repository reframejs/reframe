# `@reframe/path-to-regexp`

Routing with [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp).

Note that the npm module `path-to-regexp` is not used directly, but React Router's wrapper `react-router/matchPath` is used instead.

### Usage

~~~js
// reframe.config

const pathToRegexp = require('@reframe/path-to-regexp'); // npm install @reframe/path-to-regexp

module.exports = {
    plugins: [
        pathToRegexp()
    ],
};
~~~
