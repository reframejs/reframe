!MENU_ORDER 10
!MENU_INDENT 12
!MENU_LINK /../../
!OUTPUT ../readme.md
!INLINE ./snippets/header.md --hide-source-path
!MENU
&nbsp;

Framework to create web apps.

Designed for high development speed with no sacrifice on flexibility.

Assembles a JavaScript stack that integrates with:
<br/> &nbsp; &#8226; &nbsp; Node.js servers (Express, Koa, Hapi, ...)
<br/> &nbsp; &#8226; &nbsp; Modern frontend (React, Vue.js, React Native Web, ...)
<br/> &nbsp; &#8226; &nbsp; Node.js ORMs (Objection.js, TypeORM, ...)
<br/> &nbsp; &#8226; &nbsp; Utils (TypeScript, React Router, PostCSS, ...)

All stacks are supported:
<br/> &nbsp; &#8226; &nbsp; frontend + backend + database/ORM (aka full-stack)
<br/> &nbsp; &#8226; &nbsp; frontend + backend (aka SSR)
<br/> &nbsp; &#8226; &nbsp; frontend-only (aka static site)
<br/> &nbsp; &#8226; &nbsp; backend-only (aka old-school app with plain old HTML)

<br/>

<a href="/examples/simple/pages/welcome.config.js" target="_blank">
<img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true' align="left"/>
</a>
That's it:
We simply define a React component and a so-called page config.
No build configuration,
no server configuration.
(But if you want to, you can configure and take control over everything.)

<br/>
<br/>

#### Contents

 - [Why Reframe](#why-reframe)
 - [Quick Start](#quick-start)
 - [Examples](#examples)

<br/>

## Why Reframe

There are many web frameworks out there with huge adoption, including Ruby on Rails, Django and Next.js.
So why do we need another one?
The main reasons are around flexibility.

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between development speed and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe is designed from the ground up to be entirely flexible.
We would even argue that Reframe is more flexible than gluying do-one-thing-do-it-well libraries yourself.

Reframe's flexibility is based on three pillars:

1. **Progressive Eject** -
   All Reframe parts are ejectable:
   You can eject and take control over
   the build configuration (the webpack config),
   the render code,
   the routing code,
   the server code,
   etc.

2. **Slim core** -
   We isolate a maximum of code in do-one-thing-do-it-well libraries.
   That way, we manage to keep glue code to a tiny ~500 lines of code.
   Ejecting everything leaves you with only ~500 LOC.

3. **Flexible stack** -
   You can easily
   and at any time
   remove/add a frontend, backend, and database/ORM to your app.
   For example, you can start with a static site and later add a Node.js server.

Benefits of that flexibility:

**Take Over Control** -
As your prototype grows into a large application,
you progressively eject and take control over Reframe parts.

**Removable** -
If you eject all Reframe parts then you effectively get rid of Reframe.
At that point your code doesn't depend on Reframe anymore and only depends on do-one-thing-do-it-well libraries
(such as React, Express, Webpack, etc.).

**Rapid Prototyping** -
When starting out, you most often don't know what stack is right.
Reframe embraces that:
You can change your app's stack at any time.
For example,
you can implement a prototype as a static site
while skipping a real database by hard-writing data in the codebase.
Later, when hard-writing data isn't sustainable anymore,
you can add a Node.js server and a real database.

**Learn Once, Write Any App** -
Instead of learning several frameworks,
learn Reframe to be able to implement any app.
For example,
you can use Reframe
to implement a static site with Vue.js but
you can also use Reframe
to implement a React SSR app.

!INLINE ./top-link.md #contents --hide-source-path

<br/>
<br/>





## Quick Start

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #contents --hide-source-path

<br/>
<br/>





## Examples

- [Frontend](#frontend)
- [Full-stack](#full-stack)

### Frontend

We define a page config `HelloPage`:

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/hello.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

And that's it,
we created a frontend simply by defining one page config.

!INLINE ./top-link.md #examples Examples --hide-source-path
<br/>
!INLINE ./top-link.md #contents --hide-source-path
<br/>
<br/>

### Full-stack

Let's look at a Todo app implemented with
[Objection.js](https://github.com/Vincit/objection.js)
and
[Wildcard API](https://github.com/brillout/wildcard-api).

First we define our models with Objection.js:

~~~js
!INLINE ../examples/objection/db/models/Todo.js --hide-source-path
~~~
~~~js
!INLINE ../examples/objection/db/models/User.js --hide-source-path
~~~

Then we create an API endpoint:
~~~js
!INLINE ../examples/objection/server/endpoints/view-endpoints.js --hide-source-path
~~~

We use our API endpoint to retrieve the data from the frontend:
~~~js
!INLINE ../examples/objection/pages/LandingPage.config.js --hide-source-path
~~~

<br/>
<br/>
