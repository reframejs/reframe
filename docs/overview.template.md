!INLINE ./links.md --hide-source-path
!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Example](#example)
 - [Getting Started](#getting-started)

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

Yet, thanks to "Progressive Eject"
you can take control over everything.
Reframe **doesn't lock you in**.
You **quickly implement a prototype while staying fully flexible down the road**.

Reframe is a "Universal Framework":
You can create any type of app:
a modern **interactive frontend with React**,
a Node.js backend with **old-school non-interactive HTML pages**,
a **static site generated with Vue.js** components,
a **full-stack app** with modern frontend + Node.js server + **Database/ORM** (ORM integration is WIP).
Changing from one type of app to another is easy.
**Start write your prototype right away
without thinking about what type of app is right for you**.

When we say Reframe is rapid and flexible, we mean it.

More at [Concetps](/docs/concepts.md).

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>

### Example

We create an app
by defining a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

That's it: We created an entire web app simply by defining one page config. No build config, no server config.

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>

### Getting Started

Choose a starter:

- [React Server](/docs/react-server-starter.md)
- [React Frontend](/docs/react-frontend-starter.md)
- [React Database](/docs/react-database-starter.md)

They scaffold the following:

&nbsp; | React Frontend | React Server | React Database
--- | :---: | :---: | :---:
React Frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js Server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

Don't bother choosing the right starter:
You can easily add/remove a Node.js server and add/remove a database/ORM.

Quickly choose a starter and start write your prototype.
As your prototype grows add/remove what you need.

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>
