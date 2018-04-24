Reframe + React = :heart:

# `@reframe/react`

Use Reframe with React.

### Usage

Add `@reframe/react` to your `reframe.config.js` and the `view` property of your page configs will be rendered with React.

Note that `@reframe/react` is included in Reframe's React-Kit [`@reframe/react-kit`](/react-kit).

~~~js
// reframe.config.js

const react = require('@reframe/react'); // npm install @reframe/react

module.exports = {
    plugins: [
        react()
    ],
};
~~~
