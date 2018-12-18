!MENU_SKIP

# `@universal-adapter`

`@universal-adapter` packages are about finding the common denominator for libraries that do similar things.

Allowing library authors to develop against a single abstraction instead of n different library APIs.

## Server adapters

The server adapters allow you to integrate with several server frameworks at once.

 - Express adapter: `@universal-adapter/express`
 - Hapi adapter: `@universal-adapter/hapi`
 - Koa adapter: `@universal-adapter/koa`

### Example

We define routes `/` and `/hello/{name}` that will work with Express, Hapi, and Koa:

~~~js
!INLINE ./server/example/helloPlug.js
~~~

We can now use `helloPlug` with either Express, Hapi, or Koa:

~~~js
!INLINE ./server/example/express
~~~js
~~~js
!INLINE ./server/example/hapi
~~~js
~~~js
!INLINE ./server/example/koa
~~~js
