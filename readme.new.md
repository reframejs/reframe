# Reframe

- [What is Reframe](#what-is-reframe)
- [Getting Started](#getting-started)
- [0-LOC Framework](#0-loc-framework)

### What is Reframe

With Reframe you can create web apps featuring:
- Interactive views (with React, Vue, ...)
- Node.js Server (with Hapi, Koa, Express, ...)
- Database & ORM (with Objection.js, Prisma, ...)
- API (with [Wildcard]())
- SSR (with [SSR Coin]())
- [WIP] Automatic deployment
- [WIP] Admin panel
- [WIP] CMS

Reframe is, what we call, a *0-LOC* framework: Reframe itself has no source code and the [github.com/reframejs](https://github.com/reframejs) organisation is merely a collection of libraries and starters.
You can achieve the same things than other frameworks (Django, Rails, Next.js, ...) but with a fundamental increase in freedom and robustness.

Also, we have [couple]() of [crazy]() ideas :-).

### Getting Started

Choose a starter to get started: [github.com/topics/reframe-starter](https://github.com/topics/reframe-starter).

### 0-LOC Framework

Reframe is a collection of:
- **Libraries.**
  <br/>
  Each library is a do-one-thing-do-it-well library:
  <br/>&nbsp;&nbsp;&nbsp;&nbsp; 1. It takes care of one thing and one thing only.
  <br/>&nbsp;&nbsp;&nbsp;&nbsp; 2. It can be used independently of other libraries.
  <br/>
  Libraries are unopinionated and can be used for all kinds of uses cases.
- **Starters.**
  <br/>
  A starter assembles libraries into a well-polished scaffold (aka boilerplate) allowing you to quickly get started.
  Starters are opinionated and tailored towards specific use cases.

We call a framework that has no source code and is only a collection of libraries and starters a *0-LOC framework*.
The benefits are plenty:

**Freedom** :dove:

A 0-LOC framework introduces a fundamental shift in freedom:

- **Cherry pick libraries.** -
  <br/>
  You are free to cherry pick any do-one-thing-do-it-well library as you want.
  You want to use only one Reframe library? That's fine: you can use it without the rest of Reframe.
- **No lock-in.**
  <br/>
  You can quickly get started by using a starter and later replace Reframe libraries as you see fit.
  Removing Reframe simply means removing each Reframe library
  You can start with and than replace libraries.
  For example,
  you can start using Reframe's auto-deploy library and later replace it with your custom deploy strategy.

  Removable
For example, among all Reframe libraries, you can choose to use only [Wildcard API](),
or you can choose a Reframe starter but use another ORM.
There is no lock-in;
you can replace any library with another one, or with your custom implementation.
For example you can use a Reframe starter and later replace [Wildcard API] with a RESTful/GraphQL API.
React with the next cool thing (yes, we are [evaluating Svlete]()).

**Robust** :mountain:

A 0-LOC framework is also fundamentally more robust:

- **Robust libraries** -
  <br/>
  Do-one-thing-do-it-well libraries tend to be robust.
  They usually compete with many libraries that do the same thing
  and the best ones can survive a very long time resulting into a hardened and rock-solid library.

- **Robust framework** -
  <br/>
  Adopting the next new technolgoy means switching out one or two do-one-thing-do-it-well libraries,
  while the rest of Reframe works as before.
  This is fundamentally more flexible, robust, and future-proof than monolothic frameworks that interleave everything.

- **Framework collaboration** -
  <br/>
  A Reframe library can be used within another framework.
  We hope that framework authors will follow the 0-LOC philosophy so that Reframe can start using libraries of other frameworks.
  We envision a future where frameworks share libraries for a more vibrant and robust JavaScript ecosystem.
