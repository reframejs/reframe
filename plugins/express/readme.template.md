!MENU_SKIP

# `@reframe/express`

Use Reframe with Express.

### Usage

Add `@reframe/express` to your `reframe.config.js`:

~~~js
module.exports = {
  $plugins: [
    require('@reframe/react-kit'),
    require('@reframe/express')
  ]
};
~~~

Then eject the server code:

~~~js
$ reframe eject server
~~~

### Example

Example of a reframe app with ejected Express server code.

~~~js
!INLINE ./example/server/start.js
~~~
