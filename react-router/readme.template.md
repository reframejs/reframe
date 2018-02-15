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
!INLINE ./example/reframe.config
~~~

~~~js
!INLINE ./example/pages/page.universal.js
~~~
