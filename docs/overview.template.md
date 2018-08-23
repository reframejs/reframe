!INLINE ./links.md --hide-source-path
!INLINE ./header.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

<br/>

# Overview

 - [Introduction](#introduction)
 - [Examples](#examples)
 - [Getting Started](#getting-started)

<br/>
<br/>


### Introduction


Reframe is a framework to create web apps.

Reframe's stack is:
React (or Vue) + Node.js (optional) + [TypeORM](https://github.com/typeorm/typeorm) (optional).


~~~jsx
// ~/my-app/pages/WelcomePage.config.js

!INLINE ../examples/basics/pages/WelcomePage.config.js --hide-source-path
~~~

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

<br/>

**Rapid**

Reframe assembles a stack optimized for quickly implementing prototypes.

And as your prototype grows into a serious app, Reframe gradually gives away control to you and your team.

<br/>

**Removable**

A good parent knows when it's time to let go of his child.

Just like a 19-year-old doesn't want his parents to dictate his life,
a team of 5 developers doesn't want a framework to dictate how to do things.

Reframe is designed from the ground up to be gradually removed:
As your app grows you eject parts of Reframe.
Once every part is ejected, Reframe is fully removed and you have full control over the stack.

Where other frameworks are clingy parents that can't let go,
Reframe knows how to let go.

<br/>

Reframe supports a wide range of stacks.
This means that if you don't know at first what stack is right for you, that's ok:
You can choose a stack with your best guess at first,
and later change the stack as it becomes clear what you need.
(Reframe is designed so that you can easily change the stack.)

**Full-stack Apps**

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend
 - Node.js ORM (Such as [TypeORM](https://github.com/typeorm/typeorm).)

<br/>

**Frontend + Backend** (SSR apps)

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend

By default, Reframe renders your pages to both HTML and the DOM.
(It's a technique called SSR (Server-Side Rendering) and plays an important role for performance, SEO, and SMO.)

<br/>

**Frontend only** (Static sites)

Stack composed of:
 - Modern interactive frontend (with React or Vue)

Your app consists of static browser assets only. (JavaScript files, CSS files, images, fonts, etc.)

No Node.js server is required and your app can be deployed to a static host such as Netfliy or GitHub Pages.

This stack is ideal if you don't need a backend (or if you already implemented one).

(Frontend only apps are also commonly called "static sites".)

<br/>

**Backend only**

Stack composed of:
 - Node.js Backend

Your app has no (or almost no) browser-side JavaScript.

You still use JavaScript on the server with Node.js and with React to generate the HTML of your pages.
(React can render views not only to the DOM but as well to HTML.)

We recommand this if you don't need interactive views.

This stack is well suited for mobile.
(Browser-side JavaScript is a performance killer on mobile.)

You can add a Node.js ORM to that stack.

<br/>

**Mixed Web Apps**

We introduce a new kind of app: "Mixed Web Apps" (MWA).

Non-interactive views are considerably easier to implement and more performant than interactive views.

MWAs are about combining non-interactive views with interactive views.

We believe MWAs to be the future of web dev.

<br/>

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
