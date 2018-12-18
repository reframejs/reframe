!MENU_SKIP

# `@brillout/browser-config`

A 1-LOC package to have a global configuration object in the browser. (Works in Node.js too.)

### Usage

~~~js
!INLINE ./example/config.js
~~~

~~~js
!INLINE ./example/run.js
~~~

### How it works

It's trivial: The package simply exports a plain JavaScript object that acts as the global configuration object.

The source code is:

~~~js
!INLINE ./index.js
~~~
