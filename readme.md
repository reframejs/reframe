<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.






-->
<p align="right">
    <sup>
        <a href="#">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/star.svg?sanitize=true"
              width="16"
              height="12"
            >
        </a>
        Star if you like
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://github.com/reframejs/reframe/blob/master/docs/contributing.md">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/biceps.min.svg?sanitize=true"
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
              src="https://github.com/reframejs/reframe/raw/master/docs/images/twitter-logo.svg?sanitize=true"
              width="15"
              height="13"
            >
            Follow on Twitter
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;
        <a href="https://discord.gg/kqXf65G">
            <img
              src="https://github.com/reframejs/reframe/raw/master/docs/images/chat.svg?sanitize=true"
              width="14"
              height="10"
            >
            Chat on Discord
        </a>
        &nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;
    </sup>
</p>
<br/>
<br/>
<p align="center">
  <a href="https://github.com/reframejs/reframe">
    <img src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.min.svg?sanitize=true" width=450 height=94 style="max-width:100%;" alt="Reframe"/>
  </a>
</p>

<p align="center">
  Framework to create web apps.
</p>
<p align="center">
  <b>Rapid</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Implement&nbsp;apps&nbsp;in&nbsp;no&nbsp;time.
  <br/>
  <b>Removable</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Gradually&nbsp;remove Reframe as your app grows.
</p>

<br/>
<br/>
<br/>

[**Overview**](/../../)<br/>
Starters: [React Server](/docs/react-server-starter.md) | [React Frontend](/docs/react-frontend-starter.md) | [React Database](/docs/react-database-starter.md)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Concepts](/docs/concepts.md)<br/>
[Plugins](/docs/plugins.md)

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

import React from 'react';

const WelcomePage = {
  route: '/welcome',
  view: () => <div>Welcome to Reframe</div>,
  title: 'Welcome'
};

export default WelcomePage;
~~~

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

<br/>

**Rapid**

Reframe assembles a stack optimized for quickly implementing prototypes.

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

Reframe's stack is flexible that is you can easily change it while your app grows.

This is of importance because when you start writing your prototype you often don't know what stack is right for you.
With Reframe that's ok:
You can choose a stack with your best guess at first,
and later change the stack as it becomes clear what you need.

<br/>

**Full-stack**

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend
 - Node.js ORM ([TypeORM](https://github.com/typeorm/typeorm))

<br/>

**Frontend + Backend** (SSR apps)

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend

By default, Reframe renders your pages both to HTML and to the DOM.
(This practice is called SSR (Server-Side Rendering) which plays an important role for performance, SEO, and SMO.)

<br/>

**Frontend only** (Static sites)

Stack composed of:
 - Modern interactive frontend (with React or Vue)

Your app consists of static browser assets only. (JavaScript files, CSS files, images, fonts, etc.)
No Node.js server is required and your app can be deployed to a static host such as Netfliy or GitHub Pages.

This stack is ideal if you don't need a backend (or if you already implemented one).

<br/>

**Backend only**

Stack composed of:
 - Node.js Backend

Your app has no (or almost no) browser-side JavaScript.
You still use JavaScript on the server with Node.js and React to generate the HTML of your pages.
(React can render views to HTML.)

We recommend this if you don't need interactive views.

<br/>

**Mixed Web Apps**

We introduce a new kind of app: "Mixed Web Apps" (MWA).

Non-interactive views are considerably easier to implement and more performant than interactive views.
MWAs are about combining non-interactive views with interactive views.

We believe MWAs to be the future of web dev.

<br/>

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>



### Examples

- [Frontend](#frontend)
- [Full-stack](#full-stack)

###### Frontend

We define a page config `HelloPage`.

~~~jsx
// ~/my-app/pages/HelloPage.config.js

// By default you write your views with React.
// You can use another view library such as Vue.
import React from 'react';

const HelloPage = {
  route: '/hello/:name', // Parameterized route
  title: 'Hi there', // Page's <title>
  view: props => {
    // The route argument `name` is available at `props.route.args`
    const name = props.route.args.name;
    return (
      <div>Hello {name}</div>
    );
  }
};

export default HelloPage;
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

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>





### Getting Started

Choose a starter:

- [React Server](/docs/react-server-starter.md)
- [React Frontend](/docs/react-frontend-starter.md)
- [React Database](/docs/react-database-starter.md) (Work-in-progress)

They scaffold the following:

&nbsp; | React Frontend | React Server | React Database
--- | :---: | :---: | :---:
React Frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js Server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

Don't bother choosing the right starter:
You can easily add/remove a Node.js server and add/remove a database/ORM afterwards.
Instead, quickly choose a starter and start write your prototype.
As your prototype grows add/remove what you need.

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/overview.template.md` instead.






-->
