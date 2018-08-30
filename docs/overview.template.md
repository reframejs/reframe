!INLINE ./header.md --hide-source-path
<br/>
!INLINE ./links.md --hide-source-path

!MENU
!MENU_INDENT 12
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Examples](#examples)
 - [Getting Started](#getting-started)

<br/>

### Introduction

Reframe is a framework to create web apps.

It assembles a JavaScript stack that has integrations for
Node.js, React, React Native Web, React Router, Vue.js, TypeScript, TypeORM, PostCSS, Webpack, Express, Koa, Hapi, etc.

All kinds of JavaScript stacks are supported:
Full-stack (modern interactive frontend + Node.js server + database with a Node.js ORM),
frontend + backend (aka SSR app),
frontend only (aka static site),
backend only,
etc.

Reframe is born out of the belief that a web framework can offer high development speed while being highly flexible at the same time.

<br/>

**Rapid Development**

You can create a web app by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true'/>
</p>

That's it, we created a web app simply by defining one React component and one page config.

Yet, Reframe is designed from the ground up to be highly flexible.

<br/>

**Flexible**

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between development speed and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe greatly cares about flexibility.
It is (to our knowledge) the most flexible web framework out there.
We would actually argue that Reframe is more flexible than gluying do-one-thing-do-it-well libraries yourself.

Reframe's flexibility is based on three pillars:

1. **Progressive Eject** -
   All Reframe parts are ejectable:
   You can eject the build configuration, and/or the render code, and/or the routing code, and/or the server code, etc.

2. **Minimal glue code** -
   We isolate a maximum of code in do-one-thing-do-it-well libraries.
   That way, we manage to keep the glue code to a tiny ~500 lines of code.

3. **Flexible stack** -
   Reframe assembles a flexible stack:
   You can configure your app to have a frontend only (aka static site), a frontend + backend (aka SSR app), a backend only (aka old-school app with plain old HTML), or a frontend + backend + database/ORM (aka full-stack app).
   Also, it is easy to later remove/add a backend, frontend, or database/ORM to an existing app.

Benefits of Reframe's flexibility:

**Take Over Control** -
You can eject and take control over Reframe parts
as your app grows and as the need arises.
All Reframe parts are ejectable which means that you can gain full control.

**Removable** -
If you eject all Reframe parts then you effectively get rid of Reframe.
At that point your code doesn't depend on Reframe anymore and only depends on do-one-thing-do-it-well libraries
(React/Vue, Hapi/Koa/Express, Webpack, ...).

**Rapid Prototyping** -
You can change your app's stack at any point in time which comes in handy for quick prototyping.
For example,
you can have your first prototype to be a frontend only (static site)
that you can easily deploy (to a static host such as Netlify or GitHub Pages).
You would skip a database by hard-writing the data in your code base.
Then, at a later point when hard-writing data isn't sustainable anymore, you would add a server and a real database to your prototype.

**Learn Once, Write Any App** -
Instead of learning different web frameworks to implement apps with different JavaScript stacks,
you can learn Reframe to implement apps with all kinds of JavaScript stacks.




!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>



### Examples

- [Frontend](#frontend)
- [Full-stack](#full-stack)

###### Frontend

We define a page config `HelloPage`:

~~~jsx
// ~/my-app/pages/HelloPage.config.js

!INLINE ../examples/basics/pages/HelloPage.config.js --hide-source-path
~~~

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/hello.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

And that's it,
we created a frontend simply by defining one page config.

###### Full-stack

Let's look at a Todo App.
(Note that the database/ORM integration shown here is work-in-progress.)

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

And that's it,
we simply defined pages, data models, and permissions to create a full-stack app.

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>





### Getting Started

!INLINE ./getting-started.md --hide-source-path

!INLINE ./top-link.md #overview --hide-source-path

<br/>
<br/>
