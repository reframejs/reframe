# Reframe

Reframe is a collection of libraries and starters for creating web apps with:
- Interactive views (with React, Vue, ...)
- Node.js Server (with Hapi, Koa, Express, ...)
- Database & ORM (with Objection.js, Prisma, ...)
- API (with [Wildcard]())
- SSR (with [SSR Coin]())


Reframe is what we call a *0-LOC framework*:
this repository has no source code
and [github.com/reframejs](https://github.com/reframejs) is merely a collection of:
 - **Libraries.**
   Each libary is a do-one-thing-do-it-well library:
   a library takes care of one thing and one thing only and can be used independently of other libraries.
 - **Starters.**
   A starter assembles libraries into a well-polished scaffold so you can quickly get started (aka boilerplate).
   Starters aim to be as easy to use and as feature-rich as monolithic frameworks (Django, Rails, ...).

The benefits of the 0-LOC approach are plenty:

**Freedom** -
You are entirely free to cherry pick as few, as many, and any do-one-thing-do-it-well library you want.
For example, among all Reframe libraries, you can choose to use only [Wildcard API](),
or you can choose a Reframe starter but use another ORM.
There is no lock-in;
you can replace any library with another one, or with your custom implementation.
For example you can use a Reframe starter and later replace [Wildcard API] with a RESTful/GraphQL API.
React with the next cool thing (yes, we are [evaluating Svlete]()).
Or you can start using Reframe's auto-deploy library and later replace it with your custom deploy strategy.

**Robust tools** -
Do-one-thing-do-it-well libraries tend to be more robust than frameworks.
They usually compete with many libraries that do the same thing
and they can survive a very long time resulting a hardened rock-solid tool.

**Robust framework** -
All do-one-thing-do-it-well libraries work independently of each other which makes things future proof.
For example, a new view library comes and makes React obsolete?
That's cool and you'll be able to use this new view library since all Reframe libraries work with any view library.

**Collaboration** -
All do-one-thing libraries we wrote can be used independently and even within a framework other than Reframe.
We hope that other frameworks will follow the 0-LOC philosophy and we envision a future were Reframe uses
the library of other 0-LOC frameworks and vice-versa.


Current list of Starters:
 - Reframe Objection - Create a SQL-centric app with database, API, and interactive views
 - Reframe Prisma [WIP] - Create An ORM-centric app with database, API, and interactive views
 - Reframe Static Website [WIP] - A static website with modern technologies

Work-in-progress:
- Automatic deployment - [WIP ticket #9]()
- Admin panel - [WIP ticket #1]()
- CMS - [WIP ticket #3]()

We also have [couple]() of [crazy]() ideas ;-).
If this all excits you, then join us!

