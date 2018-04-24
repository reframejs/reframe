Reframe's React-Kit

# `@reframe/react-kit`

The React-Kit includes:
 - [@reframe/react](/react)
 - [@reframe/path-to-regexp](/path-to-regexp)
 - And other things. (See the react kit's source code to see these things.)

### Usage

The React-Kit is automatically included when listed as dependency in your `dependencies` field of your `package.json`.

You can also add the React-Kit over the `reframe.config.js`:

~~~js
// reframe.config.js

const defaultKit = require('@reframe/react-kit'); // npm install @reframe/react-kit

module.exports = {
    plugins: [
        defaultKit()
    ],
};
~~~
