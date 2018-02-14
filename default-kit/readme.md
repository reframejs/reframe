Reframe's default kit

# `@reframe/default-kit`

The default kit includes:
 - [@reframe/react](/react)
 - [@reframe/path-to-regexp](/path-to-regexp)
 - And other things. (See the default kit's source code to see these things.)

The default kit is included by default.

### Usage

To remove the default kit:

~~~js
// reframe.config

module.exports = {
    skipDefaultKit: true
    plugins: [
        // You will need to include:
        // - A rendered (e.g. `@reframe/react`)
        // - A router (e.g. `@reframe/path-to-regexp` or `@reframe/crossroads`)
        // - And more stuff. Look at the source code of `@reframe/default-kit`.
    ],
};
~~~

To add it manually:

~~~js
// reframe.config

const defaultKit = require('@reframe/default-kit'); // npm install @reframe/default-kit

module.exports = {
    plugins: [
        defaultKit()
    ],
};
~~~
