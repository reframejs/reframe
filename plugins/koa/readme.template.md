!MENU_SKIP

# `@reframe/koa`

Use Reframe with Koa.

### Usage

Add `@reframe/koa` to your `reframe.config.js`:

~~~js
module.exports = {
  $plugins: [
    require('@reframe/react-kit'),
    require('@reframe/koa')
  ]
};
~~~

Then eject the server code:

~~~js
$ reframe eject server
~~~

### Example

Example of a reframe app with ejected Koa server code.

~~~js
!INLINE ./example/server/start.js
~~~
