# Reframe

- [What is Reframe](#what-is-reframe)
- [Getting Started](#getting-started)
- [0-LOC Framework](#0-loc-framework)

### What is Reframe

With Reframe you can create web apps that features:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Interactive views (with React, Vue, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Node.js Server (with Hapi, Koa, Express, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Database & ORM (with Objection.js, Prisma, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
API (with [Wildcard](https://github.com/reframejs/wildcard-api))
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
SSR (with [SSR Coin](https://github.com/reframejs/ssr-coin))
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
[WIP]: Automatic deployment, Admin panel, CMS

Reframe is a *0-LOC framework*: it has no source code and [github.com/reframejs](https://github.com/reframejs) is merely a collection of libraries and starters.
You can get started as quickly as other frameworks (Django, Rails, Next.js, ...) but with a fundamental increase in freedom and robustness.

### Getting Started

Choose a starter to get started: [github.com/topics/reframe-starter](https://github.com/topics/reframe-starter).

### 0-LOC Framework

Reframe is a collection of:
- **Libraries** -
  Each library is a do-one-thing-do-it-well library:
  it takes care of one thing and one thing only and
  it can be used independently of other libraries.
- **Starters** -
  A starter assembles libraries into a well-polished scaffold (aka boilerplate) allowing you to quickly get started.

We call this a *0-LOC framework*: a framework that has no source code and that is only a collection of libraries and starters.
The benefits are plenty:

**Freedom**

A 0-LOC framework introduces a fundamental shift in freedom:

- **Cherry pick libraries** -
  Each library can be used individually and independently of other libraries. You can choose which libraries you want to use.
- **No lock-in** -
  Reframe being merely a collection of libraries and starters, there is virtually no lock-in.

**Robust**

A 0-LOC framework is also fundamentally more robust:

- **Robust libraries** -
  Do-one-thing-do-it-well libraries tend to be robust.
  They compete with lots of libraries that do the same thing
  and the ones that survive a long time become hardened and rock-solid.

- **Robust framework** -
  A starter can easily adopt new technologies by switching out one or two libraries, while the rest of the starter stays the same.
  Such modular approach based on do-one-thing-do-it-well libraries is fundamentally more flexible, robust, and future-proof than monolothic frameworks that interleave everything.

- **Framework collaboration** -
  The libraries we write can be used within another framework.
  We hope our fellow framework authors to follow the 0-LOC philosophy and
  we envision a future where frameworks share many libraries for a more vibrant and robust JavaScript ecosystem.