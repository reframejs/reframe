<a href="/../../#readme">
    <img align="left" src="https://github.com/reframejs/reframe/raw/master/images/logo-with-title-and-slogan.min.svg?sanitize=true" width=296 height=79 style="max-width:100%;" alt="Reframe"/>
</a>
<br/>
<p align="right">
    <sup>
        <a href="#">
            <img
              src="https://github.com/reframejs/reframe/raw/master/images/star.svg?sanitize=true"
              width="16"
              height="12"
            >
        </a>
        Star if you like
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://github.com/reframejs/reframe/blob/master/contributing.md">
            <img
              src="https://github.com/reframejs/reframe/raw/master/images/biceps.min.svg?sanitize=true"
              width="16"
              height="14"
            >
            Co-maintain Reframe
        </a>
    </sup>
    <br/>
    <sup>
        <a href="https://twitter.com/reframejs">
            <img
              src="https://github.com/reframejs/reframe/raw/master/images/tw.svg?sanitize=true"
              width="15"
              height="13"
            >
            Follow on Twitter
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://discord.gg/kqXf65G">
            <img
              src="https://github.com/reframejs/reframe/raw/master/images/chat.svg?sanitize=true"
              width="14"
              height="10"
            >
            Chat on Discord
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
    </sup>
</p>
&nbsp;
<p align='center'>
<a href="#what-is-reframe">What is Reframe</a>
&nbsp; | &nbsp;
<a href="#getting-started">Getting Started</a>
&nbsp; | &nbsp;
<a href="#zero-loc-framework">Zero-LOC Framework</a>
</p>

## What is Reframe

Reframe is web framework that helps you to quickly get started with a modern stack:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Interactive Frontend (React)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Node.js server
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
API (RPC-like API)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
SSR

What makes Reframe special is that:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
We teach about modern web development and we clarify how to take crucial decisions. (REST, GraphQL, or RPC? Redux or stateful components? Interactive views or plain old HTML? Server-side rendering/routing or client-side rendering/routing? Etc.) **(Work-in-progress)**
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
It's built with a rock solid yet super flexible fundation &mdash; Reframe is what we call a "Zero-LOC framework".
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Simplicity is our thing. We believe it's possible to have a modern & simple stack.

Reframe is new but already used in production at couple of projects,
every release is assailed against a heavy suit of automated tests,
we are responsive and enjoy talking with our users,
and we fix issues within 1-2 days.

<br/>

## Getting Started

Use one of our starters to quickly get up and running:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
[reframe-full-stack](https://github.com/reframejs/reframe-full-stack) -
Frontend (React) + Backend (Node.js, Hapi) + API (Wildcard) + SSR (ssr-coin).
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
[reframe-frontend](https://github.com/reframejs/reframe-frontend) -
Frontend (React) + Static Rendering (ssr-coin).

We recommend the
[reframe-full-stack starter](https://github.com/reframejs/reframe-full-stack)
if you need a server and the
[reframe-frontend starter](https://github.com/reframejs/reframe-frontend)
otherwise.
For example:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Your app doesn't require a server (a blog, a homepage, ...) &#8658; [reframe-frontend](https://github.com/reframejs/reframe-frontend).
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
You already have a server (a Firebase backend, a Java backend, ...)  &#8658; [reframe-frontend](https://github.com/reframejs/reframe-frontend).
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
You want a Node.js server with a database &#8658; [reframe-full-stack](https://github.com/reframejs/reframe-full-stack).
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
You need SSR &#8658; [reframe-full-stack](https://github.com/reframejs/reframe-full-stack).

You can use [a community starter](https://github.com/topics/reframe-starter)
for alternative stacks
or you can assemble our libraries into a custom stack yourself.
(Our libraries can be used individually and independently of each other and independently of Reframe.)

<br/>

## Zero-LOC Framework

We call a *Zero-LOC framework*, a framework that is merely a collection of:
- **Libraries** -
  Where each library is do-one-thing-do-it-well:
  it takes care of one thing and one thing only
  and can be used individually and independently of other libraries.
- **Starters** -
  A starter assembles libraries into a well-polished scaffold (aka boilerplate) for you to quickly get started.

A Zero-LOC framework allows you to develop as quickly as monolithic frameworks
(Ruby on Rails, Django, ...)
but with a fundamental increase in freedom and robustness.

Freedom:
- **Cherry pick libraries** -
  Each library can be used individually and independently of each other. You can choose which libraries you want to use.
- **No lock-in** -
  Reframe is only a collection of libraries and starters &mdash; there is virtually no lock-in.

Robustness:
- **Robust libraries** -
  Do-one-thing-do-it-well libraries
  often survive a long time resulting into hardened and rock-solid tools.
- **Robust framework** -
  Being based on robust libraries is not only a robust foundation but also a future-proof one:
  do-one-thing-do-it-well libraries can more easily adapt to the tools of tomorrow.
- **Framework collaboration** -
  We hope our fellow framework authors to follow the Zero-LOC philosophy and
  we envision a future where frameworks share many libraries for a more vibrant and robust JavaScript ecosystem.

Reframe's goal is to develop a Zero-LOC framework that is as feature-rich as Ruby on Rails.
