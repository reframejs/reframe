!INLINE ./links.md --hide-source-path
!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Features](#features)
 - [Examples](#examples)
 - [Getting Started](#getting-started)

<br/>
<br/>


### Introduction


Reframe is a web framework.

It is rapid yet temporary. Which is ideal for
prototyping.

Reframe's stack is composed of
React (or Vue) + Webpack + Node.js (optional) + TypeORM (optional).

**Rapid**

Reframe allows you to quickly implement prototypes.

It doesn't claim to solve all your problems.
Instead, it solves one and only one problem:
How to go from zero to a prototype.

As your prototype grows into something serious, Reframe gradually gives away control to you and your team.

**Temporary**

A good parent knows when it's time to let go of his child.

Just like a 19-year-old doesn't want his parents to dictate his life,
a team of 5 developers doesn't want a framework to dictate how to do things.

Reframe is designed from the ground up to be gradually removed:
As your prototype grows you eject parts of Reframe.
Once every part is ejected, Reframe is fully removed and you have full control over the stack.

Where other frameworks are clingy parents that can't let go,
Reframe knows how to let go.

More at [Concepts - Progressive Eject](/docs/concepts.md#progressive-eject).

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>




### Features

- Modern Frontend
  - **Interactive views** -
    First-class support for interactive views with React, Vue.js, etc.
  - **SEO** -
    Reframe supports Server-Side Rendering (SSR) to give you full control over SEO and SMO.
- Database
  - **ORM** -
    Integration with TypeORM.
  - **Automatic API generation**
- You can create any type of app:
  - **Full-stack app** -
    App with interactive frontend + server + database.
  - **Modern frontend** -
    A frontend without a backend.
    Ideal if you already have a backend.
  - **SPA**
  - **MPA**
  - **Static site**
  - **Old-school backend** -
    A Node.js backend with plain old HTML without interactive views.
    (No JavaScript is executed in the browser, the DOM is static. You still use React to generate dynamic HTML.)
  - **Mobile web app** -
    Browser-side Javascript is a performance killer for mobile.
    With Reframe you can buid web apps that have (almost) no browser-side JavaScript.
    (You still use JavaScript on the server with Node.js and with React to generate HTML.)
  - **Mixed Web App** -
    A new kind of app we call "Mixed Web App" (MWA).
    (See [Concepts - Non-Interactive-First Approach](/docs/concepts.md#non-interactive-first-approach).)
- **Easy deploy** -
  Integration with static hosts (Netlify, GitHub Pages, etc.).
  We are also exploring ways to automate the deployment to a serverless stack (serverless server + serverless database).
  (Work-in-progress, stay tuned at [twitter.com/reframejs](https://twitter.com/reframejs).)
- **Ejectable** -
  Fully and progressively eject Reframe to gradually gain full control over your app.
- **Integrations** - Plugins for React, React Router, Vue.js, Webpack, TypeScript, PostCSS, Hapi, Express, Koa, etc.
- **Performance** - Code-splitting, Server-Side Rendering, optimal HTTP caching, etc.

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>





### Examples

- [Frontend](#frontend)
- [Full-stack](#full-stack)

###### Frontend

We define a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

That's it.
We created a entire frontend simply by defining one page config.
No build config, no server config.

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/hello.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

###### Full-stack

Let's look at a Todo App.

~~~ts
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";

@Entity()
export class Todo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    text: string;

    @Column()
    isCompleted: boolean;

    @ManyToOne("User")
    author: "User";
}
~~~

To make our `Todo` entries accessible from our views, we define permissions:

~~~js
// Only the author of a todo item should be allowed to read & write
const isTodoAuthor = ({loggedUser, object: todo}) => loggedUser && loggedUser.id===todo.author.id;

const permissions = [
    {
        modelName: 'Todo',
        write: isTodoAuthor,
        read: isTodoAuthor,
    },
];
~~~

We can now access `Todo` entries from our view:

~~~js
import React from 'react';
import easyqlClient from '@easyql/client';

const TodoList = ({todos}) => (
    <div>{ todos.map(todo =>
        <div key={todo.id}>{todo.text}</div>
    )}</div>
);

const getInitialProps = async ({req}) => {
    const loggedUser = easyqlClient.getLoggedUser({req});
    const query = {
        queryType: 'read',
        modelName: 'Todo',
        filter: {
            author: {
                id: loggedUser.id,
            },
        },
    };
    const response = await easyqlClient.query({query, req});
    const todos = response.objects;
    return {todos};
};

export default {
    route: '/',
    view: TodoList,
    getInitialProps,
};
~~~

That's it.
We simply defined pages, data models, and permissions to build a full-stack app.

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>





### Getting Started

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>
