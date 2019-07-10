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
   Each libary is a do-one-thing-do-it-well library:
   1. It takes care of one thing and one thing only
   2. It can be used independently of other libraries.
   You like a Reframe library but you don't want the rest of Reframe? That's fine, you can use this library and not the rest.
   Libraries are often unopinionated and can be used in for all kinds of uses cases.
   Libraries and often more robust than frameworks that have multiple concerns.
 - **Starters.**
   A starter assembles libraries into a well-polished scaffold so you can quickly get started (aka boilerplate).
   Starters are opinionated and tailerod towards specific use cases.
   Using a starter provides a similar experience than using a monolithic framework (Django, Rails, ...).

We call a framework that has no source code and is only a collection of libraries and starters a *0-LOC framework*.
The benefits are plenty:

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

