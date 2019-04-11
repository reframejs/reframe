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
Node.js server (Express, Koa, Hapi, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Modern frontend (React, Vue.js, React Native Web, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Node.js ORM (Objection.js, TypeORM, ...)
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
(But, if you want, you can configure and take control over everything.)

<br/>
<br/>

#### Contents

 - [Flexible](#flexible)
 - [Quick Start](#quick-start)
 - [Example](#example)

<br/>

## Flexible

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between development speed and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe is designed from the ground up to be entirely flexible,
based on three pillars:

1. **Eject** -
   All Reframe parts are ejectable:
   You can eject and take control over
   the build code,
   the webpack config,
   the render code,
   the routing code,
   the server code,
   ...

2. **Slim** -
   Most code we write are for do-one-thing-do-it-well libraries that can be used independently of Reframe.
   Reframe in itself is only a tiny ejectable wrapper on top of do-one-thing-do-it-well libraries.

3. **Flexible stack** -
   You can easily
   and at any time
   change your app's stack.
   For example, you can start with a static site
   and add a Node.js server afterwards.

Benefits of that flexibility:

**Take Over Control** -
Not only can you eject and take control over everything,
but you can do so
progressively,
one Reframe part at a time.
Reframe is slim
and ejecting everything leaves you with only ~500 LOC.

**Removable** -
Ejecting all Reframe parts effectively removes Reframe:
Your code then doesn't depend on @reframe packages but only on do-one-thing-do-it-well libraries
(such as React, Express, Webpack, ...).

**Rapid Prototyping** -
When starting out,
you most often don't know what stack is right for you.
Reframe embraces that:
you can change your app's stack at any time.
You don't know whether or not you need SSR?
Start with your best guest and add/remove SSR
as you go.

!INLINE ./top-link.md #contents --hide-source-path

<br/>
<br/>





## Quick Start

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #contents --hide-source-path

<br/>
<br/>





## Example

Showcase of a database + server + frontend stack.

Let's create our app.
First, we define our data models with
[Objection.js](https://github.com/Vincit/objection.js):

~~~js
!INLINE ../examples/fullstack-objection/db/models/Person.js --hide-source-path
~~~
~~~js
!INLINE ../examples/fullstack-objection/db/models/Animal.js --hide-source-path
~~~

Then, we create an endpoint using [Wildcard API](https://github.com/brillout/wildcard-api#readme):
~~~js
!INLINE ../examples/fullstack-objection/server/api.js --hide-source-path
~~~

Finally, we create `PetsPage`, a page to view a person's pets:
~~~jsx
!INLINE ../examples/fullstack-objection/pages/PetsPage.config.js --hide-source-path
~~~

That's it:
We create a full-stack app with
no build configuration,
no server configuration,
no API configuration.

The [react-sql starter](/plugins/create/starters/react-sql#readme)
scaffolds such Reframe + Objection + Wildcard API stack.

!INLINE ./top-link.md #contents --hide-source-path

<br/>
<br/>
