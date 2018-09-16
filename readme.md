<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.






-->
<a href="/../../#readme">
    <img align="left" src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title-and-slogan.min.svg?sanitize=true" width=296 height=79 style="max-width:100%;" alt="Reframe"/>
</a>
<br/>
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
&nbsp;
<p align='center'><a href="/../../#readme"><b>Introduction</b></a> &nbsp; | &nbsp; <a href="/docs/starters.md#readme">Starters</a> &nbsp; | &nbsp; <a href="/docs/usage-manual.md#readme">Usage Manual</a> &nbsp; | &nbsp; <a href="/docs/concepts.md#readme">Concepts</a> &nbsp; | &nbsp; <a href="/docs/plugins.md#readme">Plugins</a></p>
&nbsp;

Framework to create web apps.
Designed for high development speed with no sacrifice on flexibility.

Assembles a JavaScript stack with integrations for:
Node.js servers (Express, Koa, Hapi),
Node.js ORMs (TypeORM & more to come),
React, React Router, React Native Web, Vue.js, TypeScript, PostCSS, etc.

All stacks are supported:
<br/> &nbsp; &#8226; &nbsp; frontend + backend + database/ORM (aka full-stack)
<br/> &nbsp; &#8226; &nbsp; frontend + backend (aka SSR)
<br/> &nbsp; &#8226; &nbsp; frontend only (aka static site)
<br/> &nbsp; &#8226; &nbsp; backend only (aka old-school app with plain old HTML)

Hello world app:
<img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true'/>
That's it.
We simply define a React component and a so-called page config.
No build configuration.
(But if you want to, you can configure and take control over everything.)

<br/>

#### Contents

 - [Why Reframe](#why-reframe)
 - [Examples](#examples)
 - [Quick Start](#quick-start)

### Why Reframe

There are many web frameworks out there with huge adoption, including Ruby on Rails, Django and Next.js.
So why do we need another one?
The main reasons are around flexibility.

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between development speed and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe is designed from the ground up to be entirely flexible.
We would even argue that Reframe is more flexible than gluying do-one-thing-do-it-well libraries yourself.

Reframe's flexibility is based on three pillars:

1. **Progressive Eject** -
   All Reframe parts are ejectable:
   You can eject the build configuration (the webpack config), and/or the render code, and/or the routing code, and/or the server code, etc.

2. **Minimal glue code** -
   We isolate a maximum of code in do-one-thing-do-it-well libraries.
   That way, we manage to keep glue code to a tiny ~500 lines of code.

3. **Flexible stack** -
   You can easily and at any time
   remove/add a frontend, backend, or database/ORM to your app.
   For example you can start with a frontend only (static site) and later add a Node.js server to it.

Benefits of that flexibility:

**Take Over Control** -
You can progressively eject and take control over Reframe parts
as your app grows and the need arises.
All Reframe parts are ejectable which means that you can gain full control.

**Removable** -
If you eject all Reframe parts then you effectively get rid of Reframe.
At that point your code doesn't depend on Reframe anymore and only depends on do-one-thing-do-it-well libraries
(e.g. React, Webpack, etc.).

**Rapid Prototyping** -
You can change your app's stack at any time which comes in handy for quick prototyping.
For example,
you could implement your first prototype as a frontend only (static site)
and skip a real database by hard-writing data in your codebase.
You could then deploy easily and for free (to a static host such as Netlify or GitHub Pages).
Later, when hard-writing data isn't sustainable anymore, you would add a server and a real database to your prototype.

**Learn Once, Write Any App** -
Instead of learning different web frameworks depending on what JavaScript stack you need,
you can learn Reframe to implement apps with any JavaScript stack.




<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>



### Examples

- [Frontend](#frontend)
- [Full-stack](#full-stack)

###### Frontend

We define a page config `HelloPage`:

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

<p align="center">
    <img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/hello.png?sanitize=true' width="780" style="max-width:100%;"/>
</p>

And that's it,
we created a frontend simply by defining one page config.

<b><sub><a href="#examples">&#8679; TOP Examples &#8679;</a></sub></b>
<br/>
<b><sub><a href="#contents">&#8679; TOP Contents &#8679;</a></sub></b>
<br/>
<br/>

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

<b><sub><a href="#examples">&#8679; TOP Examples &#8679;</a></sub></b>
<br/>
<b><sub><a href="#contents">&#8679; TOP Contents &#8679;</a></sub></b>

<br/>
<br/>





### Quick Start

1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~
   Alternatively with yarn:
   ~~~shell
   $ yarn global add @reframe/cli
   ~~~

2. Create a new Reframe app.
   ~~~shell
   $ reframe create react-frontend
   ~~~
   A `my-react-frontend/` directory is created and populated with the react-frontend starter.

3. Build and serve the app.
   ~~~shell
   $ cd my-frontend-app/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. Read the entire [Usage Basics](/plugins/create/starters/react-frontend#react-frontend) section of the react-frontend starter.

The [react-frontend starter](/plugins/create/starters/react-frontend#readme) is the recommanded starter for your first Reframe app.
But if you already know for sure that you'll need a Node.js server then checkout the [react-app starter](/plugins/create/starters/react-app#readme).
See the [list of starters](/docs/starters.md#readme) for more starters.

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/introduction.template.md` instead.






-->
