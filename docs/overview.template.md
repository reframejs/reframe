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

You simply define so called page objects and you are good to go.

No build configuration and no server configuration required.


###### Trust

Reframe assembles a stack optimized for quickly implementing prototypes.

In contrast to other frameworks Reframe doesn't do everything for you.

You may think at first

A breeze. and as soon as you need control

The opposite stance.

Framework helps you but also trusts you.
It trusts that when the right time comes you will be ok.
Other frameworks desperately try to do everything for you.
In vain

Reframe believes that trust enables true rapidness.

And as your prototype grows into a serious app, Reframe gradually gives away control.

<br/>

**Removable**

A good parent knows when it's time to let go of his child.

Just like a 19-year-old doesn't want his parents to dictate his life,
a team of 5 developers doesn't want a framework to dictate how to do things.

Reframe is designed from the ground up to be gradually removed:
As your app grows you eject parts of Reframe.
Once every part is ejected, Reframe is fully removed and you have full control over your app.

Where other frameworks are clingy parents that can't let go,
Reframe knows how to let go.

<br/>

**Flexible stack**

Reframe's stack is flexible in the sense that you can easily modify it.

you first start writing your prototype it is often not clear what stack you need.

This is of importance because when you start writing your app you often don't know what stack is right for you.
With Reframe that's ok:
You can start write a prototype and at later point you can easiy add/remove an ORM, add/remove a backend, add/remove a frontend.



<br/>

###### Full-stack

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend
 - Node.js ORM ([TypeORM](https://github.com/typeorm/typeorm))

<br/>

###### Backend + frontend (SSR apps)

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend

Your pages are rendered to both HTML and the DOM.
(This practice is called SSR (Server-Side Rendering) which plays an important role for performance, SEO, and SMO.)

<br/>

###### Frontend only (Static sites)

Stack composed of:
 - Modern interactive frontend (with React or Vue)

Your app consists of static browser assets only. (JavaScript files, CSS files, images, fonts, etc.)
No Node.js server is required and your app can be deployed to a static host such as Netfliy or GitHub Pages.

This stack is ideal if you don't need a backend (or if you already implemented one).

<br/>

###### Backend only

Stack composed of:
 - Node.js Backend

Your app has no (or almost no) browser-side JavaScript.
You still use JavaScript on the server with Node.js and React to generate the HTML of your pages.
(React can render views to HTML.)

This stack is an excellent choice if you don't need interactive views.

<br/>

###### Backend + partial Frontend


That way you can mix non-interactive views 
**Mixed Web Apps**

We introduce a new kind of app: "Mixed Web Apps" (MWA).

Non-interactive views are considerably easier to implement and more performant than interactive views.
MWAs are about combining non-interactive views with interactive views.

We believe MWAs to be the future of web dev.

For example, your landing page or your about page may have no interactive views would be wasetfull.
And if you have a interactive search page, then you can add the frontend to that page.

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
