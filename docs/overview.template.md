!INLINE ./links.md --hide-source-path
!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [100% Flexible](#100-flexible)
 - [Features](#features)
 - [Examples](#examples)
 - [Getting Started](#getting-started)

<br/>
<br/>




### Introduction

Reframe
allows you to quickly develop web apps.
While staying "100% flexible".

~~~jsx
// ~/my-app/pages/WelcomePage.config.js

!INLINE ../examples/basics/pages/WelcomePage.config.js --hide-source-path
~~~

**Reframe takes care of all the glue code**:
You can create an app with **no build configuration** and **no server configuration**.
And if you have a database an **API can be automatically generated** for you.

**But you can fully and gradually take control over the glue code**:
That is, you can progressively eject the glue code implemented by Reframe.
This gives you what we call "100% flexibility".

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>





### 100% Flexible

There are two ways to create a web app:
 - You use a framework that glues do-one-thing-do-it-well libraries for you.
 - You glue do-one-thing-do-it-well libraries yourself.

On one hand you want to glue things together yourself to keep flexibility and control.
On the other hand
you want to use a framework to quickly get things up and running.

Reframe is about giving you the best of both worlds:
The glue code is already written for you but you have the possiblity to change that glue code.

To achieve that Reframe applies following principles:
 - Isolate a maximum of code in do-one-thing-do-it-well libraries.
 - Minimize the amount of glue code.
 - Make the glue code (progressively) ejectabe.

We managed to reduce the glue code to a tiny ~500 lines of code.
This is ridiculously little.

All of Reframe's glue code is progressively ejectable.
This means that you can gradually take over the glue code.
More at [Concepts - Progressive Eject](/docs/concepts.md#progressive-eject).

With Reframe you can build an app in a scalable way:
 1. First, quickly bootstrap a prototype.
    <br/>
    (All glue code is taken care by Reframe.)
 2. Then, gradually take control over the glue code.
    <br/>
    (As your prototype grows you progressively eject Reframe's glue code as the need arises.)
    <br/>
 3. Finally, fully get rid of Reframe.
    <br/>
    (By ejecting all Reframe's glue code, your code will not depend on Reframe anymore but will depend on do-one-thing-do-it-well libraries only.
    At that point you have the exact same flexibility as if you would have glued do-one-thing-do-it-well libraries yourself in the beginning.)

That said, you will most likely eject only a fraction of the glue code.
(E.g. only ~200 lines of the total of ~500 lines of glue code.)
But if you want to take over full control, you can.

Despite Reframe's low 500 LOC of glue code, Reframe is fully featured.

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
    (You still use JavaScript on the server with Node.js and with React to generate HTML)
  - **Mixed Web App** -
    A new kind of app we call "Mixed Web App" (MWA).
    (What a MWA is about is explained in [Concepts - Non-Interactive-First Approach](/docs/concepts.md#non-interactive-first-approach).)
- **Easy deploy** -
  Integration with static hosts (Netlify, GitHub Pages, etc.).
  We are also exploring ways to automate the deployment to a serverless stack (serverless server + serverless database).
  (Work-in-progress, stay tuned at [twitter.com/reframejs](https://twitter.com/reframejs).)
- **Ejectable** -
  Fully and progressively eject Reframe to gradually gain full control over your app.
- **Integrations** - Plugins for React, React Router, Vue.js, Webpack, TypeScript, PostCSS, Hapi, Express, Koa, etc.
- **Performance** - Code-splitting, Server-Side Rendering, Optimal HTTP caching, etc.

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
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/reframe-start.png?sanitize=true' width="780" style="max-width:100%;"/>
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

To make `Todo` entries accessible from our views, we define permissions:

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
We simply define pages, data models, and permissions to build a full-stack app.

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>





### Getting Started

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>
