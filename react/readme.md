Reframe + React = :heart:

# `@reframe/react`

Use Reframe with React.

### Usage

Add `@reframe/react` to your `reframe.config` and the `view` property of your page configs will be rendered with React.

Note that `@reframe/react` is included in Reframe's default kit [`@reframe/default-kit`](/default-kit).

~~~js
// reframe.config

const react = require('@reframe/react'); // npm install @reframe/react

module.exports = {
    plugins: [
        react()
    ],
};
~~~
