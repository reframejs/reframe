<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.






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
              src="https://github.com/reframejs/reframe/raw/master/docs/images/tw.svg?sanitize=true"
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
<p align='center'><a href="/../../#readme"><b>Intro</b></a> &nbsp; | &nbsp; <a href="/docs/starters.md#readme">Starters</a> &nbsp; | &nbsp; <a href="/docs/usage-manual.md#readme">Usage Manual</a> &nbsp; | &nbsp; <a href="/docs/concepts.md#readme">Concepts</a> &nbsp; | &nbsp; <a href="/docs/plugins.md#readme">Plugins</a></p>
&nbsp;

Framework to create web apps.

Designed for high development speed with no sacrifice on flexibility.

Assembles a JavaScript stack that integrates with:
<br/> &nbsp; &#8226; &nbsp; Node.js servers (Express, Koa, Hapi, ...)
<br/> &nbsp; &#8226; &nbsp; Modern frontend (React, Vue.js, React Native Web, ...)
<br/> &nbsp; &#8226; &nbsp; Node.js ORMs (Objection.js, TypeORM, ...)
<br/> &nbsp; &#8226; &nbsp; Utils (TypeScript, React Router, PostCSS, ...)

All stacks are supported:
<br/> &nbsp; &#8226; &nbsp; frontend + backend + database/ORM (aka full-stack)
<br/> &nbsp; &#8226; &nbsp; frontend + backend (aka SSR)
<br/> &nbsp; &#8226; &nbsp; frontend-only (aka static site)
<br/> &nbsp; &#8226; &nbsp; backend-only (aka old-school app with plain old HTML)

<br/>

<a href="/examples/simple/pages/welcome.config.js" target="_blank">
<img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true' align="left"/>
</a>
That's it:
We simply define a React component and a so-called page config.
No build configuration.
No server configuration.
(But if you want to, you can configure and take control over everything.)

<br/>
<br/>

#### Contents

 - [Why Reframe](#why-reframe)
 - [Quick Start](#quick-start)
 - [Examples](#examples)

## Why Reframe

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
   You can eject the build configuration (the webpack config), the render code, the routing code, the server code, etc.

2. **Minimal glue code** -
   We isolate a maximum of code in do-one-thing-do-it-well libraries.
   That way, we manage to keep glue code to a tiny ~500 lines of code.

3. **Flexible stack** -
   You can easily
   and at any time
   remove/add a frontend, backend, or database/ORM to your app.
   For example, you can start with a static site and later add a Node.js server.

Benefits of that flexibility:

**Take Over Control** -
You can eject and take control over Reframe parts.
You can progressively eject parts
as your prototype grows into a large application.

**Removable** -
If you eject all Reframe parts then you effectively get rid of Reframe.
At that point your code doesn't depend on Reframe anymore and only depends on do-one-thing-do-it-well libraries
(such as React, Express, Webpack, etc.).

**Rapid Prototyping** -
You can change your app's stack at any time
which is crucial when prototyping.
For example,
you can implement a prototype as a static site
while skipping a real database by hard-writing data in the codebase.
Later, when hard-writing data isn't sustainable anymore,
you can add a Node.js server and a real database.

**Learn Once, Write Any App** -
Instead of learning several frameworks,
learn Reframe to be able to implement any app.
For example,
you can use Reframe
to implement a static site with Vue.js but
you can also use Reframe
to implement a SSR app with React.

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>





## Quick Start

1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~
   <details>
   <summary>With yarn</summary>

   ~~~shell
   $ yarn global add @reframe/cli
   ~~~
   </details>
   <details>
   <summary>With npx (local install)</summary>

   With
   <a href="https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b">npx</a>
   you can run the Reframe CLI without global install:
   ~~~shell
   $ npx reframe create react-frontend
   ~~~

   You then prefix every `$ reframe <command>` with `npx`.
   For example for step 3:
   ~~~shell
   $ cd `my-react-frontend/`
   $ npx reframe dev
   ~~~
   </details>

2. Create a new app with the `react-frontend` starter.
   ~~~shell
   $ reframe create react-frontend
   ~~~

3. Build and serve the app.
   ~~~shell
   $ cd `my-react-frontend/`
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. Read [Usage Manual - Basics](/docs/usage-manual.md#basics).

The `react-frontend` starter scaffolds a static site.
If you want a SSR app, a backend-only app, or a full-stack app
then choose another starter.
See [Starters](/docs/starters.md#readme).

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>





## Examples

- [Frontend](#frontend)
- [Full-stack](#full-stack)

### Frontend

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
<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>

### Full-stack

Let's look at a Todo app implemented with
[Objection.js](https://github.com/Vincit/objection.js)
and
[Wildcard API](https://github.com/brillout/wildcard-api).

First we define our models with Objection.js:

~~~js
const {Model} = require('objection');

class Todo extends Model {
  static tableName = 'todos';
  static jsonSchema = {
    type: 'object',
    properties: {
      id: {type: 'integer'},
      text: {type: 'string'},
      completed: {type: 'boolean'},
      authorId: {type: 'integer'},
    },
  };
}
module.exports = Todo;
~~~
~~~js
const {Model} = require('objection');

class User extends Model {
  static tableName = 'users';
  static relationMappings = {
    todos: {
      relation: Model.HasManyRelation,
      modelClass: require('./Todo'),
      join: {
        from: 'users.id',
        to: 'todos.authorId',
      }
    }
  }
  static jsonSchema = {
    type: 'object',
    properties: {
      id: {type: 'integer'},
      username: {type: 'string'},
      avatarUrl: {type: 'string'},
      oauthProvider: {type: 'string'},
      userProviderId: {type: 'string'},
    },
  };
}
module.exports = User;
~~~

Then we create an API endpoint:
~~~js
const Todo = require('../../db/models/Todo');
const {endpoints} = require('wildcard-api');
const {getUser} = require('./common');

endpoints.getLandingPageData = getLandingPageData;

async function getLandingPageData() {
  const user = await getUser(this);
  if( ! user ) {
    return {isNotLoggedIn: true};
  }

  const todos = await user.$relatedQuery('todos');
  return {todos};
}
~~~

We use our API endpoint to retrieve the data from the frontend:
~~~js
import React from 'react';
import {endpoints} from 'wildcard-api/client';
import TodoList from '../views/TodoList';
import LoginView from '../views/LoginView';

export default {
  route: '/',
  view: LandingPage,
  getInitialProps,
};

async function getInitialProps({isNodejs, user}) {
  let {getLandingPageData} = endpoints;
  if( isNodejs ) { getLandingPageData = getLandingPageData.bind({user}); }

  const {todos, isNotLoggedIn} = await getLandingPageData();
  return {todos, isNotLoggedIn};
}

function LandingPage({todos, isNotLoggedIn}) {
  if( isNotLoggedIn ) {
    return <LoginView/>;
  } else {
    return <TodoList todos={todos}/>;
  }
}
~~~

<br/>
<br/>

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/intro.template.md` instead.






-->
