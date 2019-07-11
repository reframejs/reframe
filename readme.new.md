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

Reframe is what we call a *0-LOC framework*: Reframe itself has no source code and the [github.com/reframejs](https://github.com/reframejs) organisation is merely a collection of libraries and starters.
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
- **Starters.**
  <br/>
  A starter assembles libraries into a well-polished scaffold (aka boilerplate) allowing you to quickly get started.

We call Reframe a *0-LOC framework*: it has no source code and it is only a collection of libraries and starters.
The benefits are plenty:

**Freedom**

A 0-LOC framework introduces a fundamental shift in freedom:

- **Cherry pick libraries** -
  Each library can be used individually and independently of other libraries, so that you can choose which libraries you want to use or not.
- **No lock-in** -
  Reframe being merely a collection of libraries and starters, there is virtually no lock-in.

**Robust**

A 0-LOC framework is also fundamentally more robust:

- **Robust libraries** -
  In general, do-one-thing-do-it-well libraries tend to become robust over time.
  They usually compete with lots of libraries that do the same thing
  and the ones that survive a long time are hardened and rock-solid.

- **Robust framework** -
  A starter can easily adopt a new technology by switching out one or two libraries, while the rest of the starter stays the same.
  Such modular do-one-thing-do-it-well approach is fundamentally more flexible, robust, and future-proof than a monolothic framework that interleaves everything.

- **Framework collaboration** -
  The libraries we write can be used within another framework.
  We hope that authors of other frameworks will follow the 0-LOC philosophy, and
  we envision a future where frameworks share lots of libraries for a more vibrant and robust JavaScript ecosystem.
