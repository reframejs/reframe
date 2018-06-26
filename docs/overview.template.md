!INLINE ./links.md --hide-source-path
!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Example](#example--top)
 - [Getting Started](#getting-started--top)

<br/>
<br/>

### Introduction

With Reframe you can create a web app simply by defining "page configs".
Your pages are automatically built and served.

~~~jsx
// A page config
const WelcomePage = {
  route: '/welcome',
  view: () => <div>Welcome to Reframe</div>,
  title: 'Welcome'
};
~~~

**No build configuration** and **no server configuration** is required.

Yet, thanks to its "Progressive Eject" feature and its simple architecture,
you can easily **customize and gain control over everything**.
Reframe doesn't lock you in: You can progressively and fully eject Reframe.
You can quickly implement a prototype while staying fully flexible down the road.

Reframe is a "Universal Framework":
You can create any type of app:
a **modern interactive frontend with React**,
a Node.js **backend with old-school non-interactive HTML pages**,
a serverless Vue Frontend,
a **full-stack app** with modern frontend + Node.js server + **Database/ORM** (ORM integration is WIP),
etc.
Changing from one type of app to another is easy.
You can start write your prototype right away and
without thinking about what type of app is right for you.

When we say Reframe is rapid yet flexible, we mean it.

See [Concetps](/docs/concepts.md) for more about Progressive Eject, Universal Framework, and other concepts such as the non-interactive-by-default approach.

 !INLINE ./top-link.md #overview

<br/>
<br/>

### Example

We create a web app
by defining a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

Reframe does the rest:

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

That's it: We created a web app simply by defining one page config. No build config, no server config.

 !INLINE ./top-link.md #overview

<br/>
<br/>

### Getting Started

Choose a starter:

- [React Server](/docs/react-server-starter.md)
- [React Frontend](/docs/react-frontend-starter.md)
- [React Database](/docs/react-database-starter.md)

The starters scaffold an app with the following:

&nbsp; | React Frontend | React Server | React Database
--- | :---: | :---: | :---:
React Frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js Server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

Don't bother choosing the right starter:
You can easily add/remove a Node.js server and add/remove a database/ORM.

Quikly choose a starter and start write your prototype.
As your prototype grows add/remove what you need.

 !INLINE ./top-link.md #overview

<br/>
<br/>
