Reframe's default kit

# `@reframe/default-kit`

The default kit includes:
 - [@reframe/react](/react)
 - [@reframe/path-to-regexp](/path-to-regexp)
 - And other things. (See the default kit's source code to see these things.)

### Usage

The default kit is included by default and you have to opt-out if you don't want the default kit:

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

In certain cases, when customizing Reframe, you will need to add the default kit yourself:

~~~js
// reframe.config

const defaultKit = require('@reframe/default-kit'); // npm install @reframe/default-kit

module.exports = {
    plugins: [
        defaultKit()
    ],
};
~~~
