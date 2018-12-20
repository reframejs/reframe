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
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Node.js servers (Express, Koa, Hapi, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Modern frontend (React, Vue.js, React Native Web, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Node.js ORMs (Objection.js, TypeORM, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Utils (TypeScript, React Router, PostCSS, ...)

All stacks are supported:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
frontend + backend + database/ORM (aka full-stack)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
frontend + backend (aka SSR)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
frontend-only (aka static site)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
backend-only (aka old-school app with plain old HTML)

<br/>

<a href="/examples/simple/pages/welcome.config.js" target="_blank">
<img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true' align="left"/>
</a>
We create an app simply by defining a React component and a so-called page config.
No build configuration,
no server configuration.
(But, if you want to, you can configure and take control over everything.)

<br/>
<br/>

#### Contents

 - [Why Reframe](#why-reframe)
 - [Quick Start](#quick-start)
 - [Example](#example)

<br/>

## Why Reframe

There are many web frameworks out there with huge adoption, including Ruby on Rails, Django and Next.js.
So, why do we need another one?
The main reasons are around flexibility.

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between development speed and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe is designed from the ground up to be entirely flexible.
We would even argue that
[Reframe is more flexible than gluying do-one-thing-do-it-well libraries yourself](/docs/concepts.md#truly-flexible).

Reframe's flexibility is based on three pillars:

1. **Eject** -
   All Reframe parts are ejectable:
   You can eject and take control over
   the build code,
   the webpack config,
   the render code,
   the routing code,
   the server code,
   etc.

2. **Slim** -
   Whenever it makes sense,
   we create do-one-thing-do-it-well libraries.
   (For example
   [Wildcard API](https://github.com/brillout/wildcard-api)
   or
   [JSON-S](https://github.com/brillout/json-s).)
   That way, Reframe stays slim.
   Reframe's codebase is a tiny ~500 lines of code.

3. **Flexible stack** -
   You can easily
   and at any time
   change the stack of your app.
   For example, you can start writing a prototype as a static site
   and add a Node.js server afterwards.

Benefits of that flexibility:

**Take Over Control** -
Not only can you eject and take control over everything,
but you can do so
progressively
as your prototype grows into a large application.
Also,
because Reframe is slim,
ejecting everything leaves you with only ~500 LOC.
Taking over control is a smooth experience.

**Removable** -
If you eject all Reframe parts then you effectively get rid of Reframe.
Your code then doesn't depend on @reframe packages anymore but only on do-one-thing-do-it-well libraries
(such as React, Express, Webpack, etc.).

**Rapid Prototyping** -
When starting out,
you most often don't know what stack is right for you.
Reframe embraces that:
You can change your app's stack at any time.
For example,
you can implement a prototype as a static site
while skipping a real database by hard-writing data in the codebase.
Later, if hard-writing data isn't sustainable anymore,
you can add a Node.js server and a real database.

**Learn Once, Write Any App** -
Instead of learning several frameworks,
learn Reframe to be able to implement all kinds of apps.
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





## Example

Showcase of a database + server + frontend stack with Reframe.

If you are interested in other kinds of stacks then check out the
[/examples](/examples) folder.

Let's create our app.

First, we define our data models with
[Objection.js](https://github.com/Vincit/objection.js):

~~~js
!INLINE ../examples/fullstack-objection/db/models/Person.js --hide-source-path
~~~
~~~js
!INLINE ../examples/fullstack-objection/db/models/Animal.js --hide-source-path
~~~

Then, we create an API with [Wildcard API](https://github.com/brillout/wildcard-api):
~~~js
!INLINE ../examples/fullstack-objection/server/api.js --hide-source-path
~~~

Finally, we create `PetsPage`, a page to view a person's pets:
~~~jsx
!INLINE ../examples/fullstack-objection/pages/PetsPage.config.js --hide-source-path
~~~

The `getPetsPageData` endpoint is tailored to our frontend:
It returns exactly and only what PetsPage needs.
We deliberately choose a custom API over a generic API (REST/GraphQL).
See [Wildcard's documentation](https://github.com/brillout/wildcard-api) for a rationale.

To our knowledge,
the Reframe + Objection + Wildcard API stack is the easiest way to create an app with a SQL database and interactive views.
And thanks to Reframe's and Objection's focus on flexibilty,
it is also the most flexible way (to our knowledge).

You can use the [react-sql](/plugins/create/starters/react-sql#readme)
starter to scaffold an app with Reframe + Objection + Wildcard API.

The entire codebase of this example can be found at
[/examples/fullstack-objection](/examples/fullstack-objection).


!INLINE ./top-link.md #examples Examples --hide-source-path
<br/>
!INLINE ./top-link.md #contents --hide-source-path
<br/>
<br/>
