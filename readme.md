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
  &nbsp;Web framework to create prototypes.
</p>
<p align="center">
  <b>Rapid</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Implement&nbsp;prototypes&nbsp;in&nbsp;no&nbsp;time.
  <br/>
  <b>Temporary</b>&nbsp;&nbsp;&#8209;&nbsp;&nbsp;Progressively ejectable.
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
 - [Features](#features)
 - [Examples](#examples)
 - [Getting Started](#getting-started)

<br/>
<br/>


### Introduction


Reframe is a web framework.
It is rapid yet temporary which is ideal for quick prototyping.

**Rapid**

Reframe allows you to quickly implement prototypes.
It aims to come with everything you need to go from zero to a prototype.

It doesn't claim to solve all your problems.
Instead, it solves one and only one problem:
How to quickly implement a prototype.

And as your prototype grows into something serious, Reframe gradually gives away control to you and your team.

**Temporary**

A good parent knows when it's time to let go of his child.

Just like a 19-year-old doesn't want his parents to dictate his life,
a team of 5 developers doesn't want a framework to dictate how to do things.

Reframe is designed from the ground up to be gradually removed:
As your prototype grows you eject parts of Reframe.
Once you ejected everything, you fully got rid of Reframe and have full control.

Where Meteor, Django and Ruby and Rails are clingy parents that can't let go,
Reframe knows how to let go.

More at [Concepts - Progressive Eject](/docs/concepts.md#progressive-eject).

<br/>

<b><sub><a href="#overview">&#8679; TOP &#8679;</a></sub></b>

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
