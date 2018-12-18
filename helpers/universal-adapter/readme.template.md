!MENU_SKIP

# `@universal-adapter`

`@universal-adapter` is about abstracting away differences of libraries that, on a high-level, do the same thing.

The goal is to allow library authors to integrate with several libraries at once.

Instead of developing against n different interfaces,
a library author can develop against a single abstract interface.

Like universal adapters of power outlets but for JavaScript.
For now, there are only adapters for server frameworks (Express, Hapi, Koa).
Adapters for other use cases could emerge in the future.

## Server adapters

The server adapters allows you to integrate with several server frameworks at once.

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
~~~
~~~js
!INLINE ./server/example/hapi
~~~
~~~js
!INLINE ./server/example/koa
~~~
