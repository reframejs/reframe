Reframe + React = :heart:

# `@reframe/react`

Use Reframe with React.

### Usage

Add `@reframe/react` to your `reframe.config.js` and the `view` property of your page configs will be rendered with React.

Note that you don't need to add `@reframe/react` if you are using Reframe's React Kit [`@reframe/react-kit`](/plugins/react-kit).
The React Kit already includes this plugin.

~~~js
// reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react') // npm install @reframe/react
    ]
};
~~~
