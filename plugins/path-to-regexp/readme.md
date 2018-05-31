# `@reframe/path-to-regexp`

Routing with [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp).

Note that `@reframe/path-to-regexp` doesn't use the npm module `path-to-regexp` directly, but uses React Router's wrapper `react-router/matchPath`.

### Usage

~~~js
// reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/path-to-regexp') // npm install @reframe/path-to-regexp
    ]
};
~~~
