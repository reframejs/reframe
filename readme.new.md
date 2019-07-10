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
  <br/>&nbsp;&nbsp; 1. It takes care of one thing and one thing only.
  <br/>&nbsp;&nbsp; 2. It can be used independently of other libraries.
  <br/>
  Libraries are unopinionated and can be used for all kinds of uses cases.
- **Starters.**
  <br/>
  A starter assembles libraries into a well-polished scaffold (aka boilerplate) for you to quickly get started.
  Starters allow you to get started as quickly as using other frameworks (Django, Rails, Next.js, ...).
  Starters are opinionated and tailored towards specific use cases.

We call a framework that has no source code and is only a collection of libraries and starters a *0-LOC framework*.
The benefits are plenty:

**Freedom**

A 0-LOC introduces a fundamental shift in freedom:

- **Cherry pick libraries.** -
  You are free to cherry pick as few do-one-thing-do-it-well library as you want.
  You like a Reframe library but you don't want to use the rest of Reframe? That's fine, you can use it without the rest.
  <br/>
- **No lock-in.**
  <br/>
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

**Robust**

Libraries

**Robust libraries** -
Do-one-thing-do-it-well libraries tend to be robust.
They usually compete with many libraries that do the same thing
and the best ones can survive a very long time resulting into a hardened and rock-solid library.

**Robust framework** -
All do-one-thing-do-it-well libraries work independently of each other which makes Reframe future proof.
Something new appears and makes a library obselete?
That's cool and adopting this new technology is only a matter of switching out a do-one-thing-do-it-well library
while the rest of Reframe works as before.
This is fundamentally more flexible and robust than monolothic frameworks that interleave everything.

For example, a new view library comes and makes React obsolete?
That's cool and you'll be able to use this new view library since all Reframe libraries work with any view library.

**Framework collaboration** -
Framework authors reinvent the wheel over and over again.
A Reframe library can be used within another framework, and we hope that framework authors will follow the 0-LOC philosophy so that Reframe can start using libraries of other frameworks.
We envision a future where frameworks share libraries for a more vibrant and robust JavaScript ecosystem.
