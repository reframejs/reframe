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
It is born out of the belief that a web framework can be rapid yet, as the same time, flexible.

Reframe assembles a JavaScript stack that can integrate with
Node.js, React, React Native Web, React Router, Vue.js, TypeScript, TypeORM, PostCSS, Webpack, Express, Koa, Hapi, etc.

<br/>

**Rapid**

You can create a web app by defining so-called "page configs".
Reframe takes care of the rest:
It automatically transpiles, bundles, routes, renders, and serves your pages.

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true'/>
</p>

That's it: We created a web app simply by defining one React component and one page config.

Yet, every Reframe part can be ejected and customized.

<br/>

**Flexible**

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between rapidness and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe greatly cares about flexiblity
and is (to our knowledge) the most flexible web framework out there.
We would even argue that Reframe is more flexible than gluying do-one-thing-do-it-well libraries yourself.

Reframe's flexibility is based on three pillars:

- **Progressive Eject** -
  All Reframe parts are ejectable:
  You can eject the build configuration, and/or the rendering, and/or the routing, and/or the server, etc.

- **Minimal glue code** -
  We isolate a maximum of code in do-one-thing-do-it-well libraries.
  That way, we managed to reduce the glue code to a tiny ~500 lines of code.

- **Flexible stack** -
  Reframe assembles a flexible stack:
  You can configure your app to have a frontend only (aka static site), a frontend + backend (aka SSR app), a backend only (aka old-school app with plain old HTML), or a frontend + backend + database/ORM (aka full-stack app).
  And it is easy to add/remove a backend, and/or a frontend, and/or a database/ORM to an existing app.

Leading to benefits:

**Take Over Control** - 
As your app grows and the need arises you can eject and take control over Reframe parts.
All Reframe parts are ejectable which means that you can gain full control.

**Easily Removable** - 
If you eject all Reframe parts then you effectively get rid of Reframe.
Your code then doesn't depend on Reframe anymore but only on do-one-thing-do-it-well libraries.

**Rapid Prototyping** -
You can change your app's stack at any point in time, which comes in handy for quick prototyping.
For example,
you can have your first prototype to be a frontend only (static site)
that can easily be deployed (to a static host such as Netlify or GitHub Pages).
You would skip a database by hard-writing the data in your code base.
Then, you would add a server and a real database at a later point when hard-writing data isn't sustainable anymore.

**Learn Once, Write Any App** -
Instead of using different frameworks for different types of JavaScript stacks,
you can use Reframe to be able to implement apps with all kinds of JavaScript stacks.









Also, as your prototype grows into something serious you can gradully get rid of Reframe to eventually remove Reframe entirely.

you can have your first prototype to be a frontend only (static site) and later on add a server and database to it.
That way
You can then easily deploy your prototype to a static host 

That way you can easily deploy your first prototype.
As add a server and real database later on.
Instead of 
For example you can start a prototype with a hard-writen fill the data in manually
databse
For example you can start with a frontend only that you can easy deploy
with that you can easily deploy to a static frontend.
And then add a server with a database.




*Learn once, write any app* -

*Any kind of app* -
Reframe supports a wide.
That you can s
Learn one framework to create any kind of app.

Whether it be a full-stack app (modern interactive frontend + backend + ORM + database),
a 
an plain old HTML,
a serverless frontend (aka static sites),
a interactive frontend +  (aka SSR apps)
old school backend.
See the examples bellow.






You may now think that Reframe takes away too much control from you.
But thanks to Reframe's *progressive eject* feature, this is actually not the case: You can eject and customize the build configuration (the webpack config), the rendering (the code calling `require('react-dom/server').renderToStaticMarkup()` and `require('react-dom').hydrate()`), the routing, the server, etc.

This means that even for edge cases
ewhen you need to 

Actually, all Reframe parts is ejectable.
Progressive ejedct basically opens all of Reframe's code wide for you to change and adapt as you whish.
This is also an increase in rapidness: you you can quickly eject and modify Reframe parts as needed.

See, for what exactly progressive eject is and what its benefinits are.
this alo

Actually, all Reframe parts are ejectable, which means that you can entirely remove Reframe.

Reframe introduces 

rapidness and customiazabibly 





But you can eject and customize every part of Reframe. (The build configuration, the routing, the rendering, etc.)

Actually, all Reframe parts are ejectable and hence customizable.

This also a gain in rapidness: If some Reframe part doesn't do what you want, eject and .
That's much easier than finding a workaround sealed off code.

Progressive eject exposes all Reframe code wide open allowing you to rapdily change and adapt whatever you want.



that you can change whenever you want.

Being able to eject and take control over whatever you want, not only enables full cusomtization but it also increases rapidness:
If you need something that Reframe does different you simply eject.
With 

We trust that you can take over control and we want you to do so.

Thanks to progressive eject is not only a enables full customization gain in flexiblity but it also enables trust.
This is 

###### Trust



No build configuration required. (But you can eject and customize Reframe's build configuration.)




We trust that you can own the code that 

Reframe's progressive eject feature is what enables that trust.

Reframe assembles a stack optimized for quickly implementing prototypes.


Other frameworks encapsulate things away from you .
This result over a loss of control.
If thi
In contrast to other frameworks Reframe trust that you can take control over things.

We trust and allow you to control build configuration, the server configuration, the rendering, the routing, etc.
: We allow you to take control Whenever you 

This is often represents an considerable improvement in increase in rapidness:
Instead of finding workarounds because, you simply eject and modifiy.

CSS-in-JS

doesn't try to do everything for you.

lightweight and a breeze.

As soon as you need something that Reframe doesn't do you eject.

For example, Reframe's Webpack configuration instead of 
In contrast to other frameworks Reframe doesn't try to polish everything to perfection.

This 
do everything for you.

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

**Easily Removable**

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

This is of importance because when you start writing a prototype you often don't know what stack is right for you.
With Reframe that's ok:
You can start write your prototype and at a later point you can easiy add/remove a backend, add/remove a frontend.

You can create apps with following stacks:

###### Full-stack

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend
 - Node.js ORM ([TypeORM](https://github.com/typeorm/typeorm))

###### Backend + frontend (SSR apps)

Stack composed of:
 - Modern interactive frontend (with React or Vue)
 - Node.js backend

Your pages are rendered to both HTML and the DOM.
(This practice is called SSR (Server-Side Rendering) which plays an important role for performance, SEO, and SMO.)

###### Frontend only (Static sites)

Stack composed of:
 - Modern interactive frontend (with React or Vue)

Your app consists of static browser assets only. (JavaScript files, CSS files, images, fonts, etc.)
No Node.js server is required and your app can be deployed to a static host such as Netfliy or GitHub Pages.

This stack is ideal if you don't need a backend (or if you already implemented one).

###### Backend only

Stack composed of:
 - Node.js Backend

Your app has no (or almost no) browser-side JavaScript.
You still use JavaScript on the server with Node.js and React to generate the HTML of your pages.
(React can render views to HTML.)

This stack is an excellent choice if you don't need interactive views.

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
