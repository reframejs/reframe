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
        <a href="https://github.com/reframejs/reframe/blob/master/contributing.md">
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
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Node.js server (Express, Koa, Hapi, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Modern frontend (React, Vue.js, React Native Web, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Node.js ORM (Objection.js, TypeORM, ...)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Utils (TypeScript, React Router, PostCSS, ...)

All stacks are supported:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
frontend + backend + database/ORM (aka full-stack)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
frontend + backend (aka SSR)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
frontend-only (aka static site)
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
backend-only (aka old-school app with plain old HTML)

<br/>

<a href="/examples/simple/pages/welcome.config.js" target="_blank">
<img src='https://github.com/reframejs/reframe/raw/master/docs/images/previews/welcome.png?sanitize=true' align="left"/>
</a>
We create an app simply by defining a React component and a so-called page config.
No build configuration,
no server configuration.
(But, if you want to, you can configure and take control over everything.)

<br/>
<br/>

#### Contents

 - [Why Reframe](#why-reframe)
 - [Quick Start](#quick-start)
 - [Example](#example)

<br/>

## Why Reframe

Web frameworks have a bad reputation regarding flexibility.
There is a general belief that there is a trade off between development speed and flexibility
and that a web framework always comes with a lost in flexibility.
We believe it doesn't have to be that way.

Reframe is designed from the ground up to be entirely flexible,
based on three pillars:

1. **Eject** -
   All Reframe parts are ejectable:
   You can eject and take control over
   the build code,
   the webpack config,
   the render code,
   the routing code,
   the server code,
   etc.

2. **Slim** -
   Most code we write are for do-one-thing-do-it-well libraries that can be used independently of Reframe.
   Reframe in itself is only a tiny ejectable wrapper on top of do-one-thing-do-it-well libraries.

3. **Flexible stack** -
   You can easily
   and at any time
   change the stack of your app.
   For example, you can start writing a prototype as a static site
   and add a Node.js server afterwards.

Benefits of that flexibility:

**Take Over Control** -
Not only can you eject and take control over everything,
but you can do so
progressively,
one Reframe part at a time.
Reframe is slim
so that ejecting everything leaves you with only ~500 LOC.

**Removable** -
If you eject all Reframe parts then you effectively get rid of Reframe:
Your code then doesn't depend on @reframe packages but only on do-one-thing-do-it-well libraries
(such as React, Express, Webpack, etc.).

**Rapid Prototyping** -
When starting out,
you most often don't know what stack is right for you.
Reframe embraces that:
You can change your app's stack at any time.
You don't know whether you need SSR or not?
Start with your best guest and change your
stack as you go.

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>





## Quick Start

1. Install the Reframe CLI:
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

   Instead of globally installing `@reframe/cli`, you can use
   [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):
   ~~~shell
   $ npx @reframe/cli create react-frontend
   ~~~

   Then prefix every `$ reframe <command>` with `npx`.
   For example:
   ~~~shell
   $ cd my-react-frontend/
   $ npx reframe dev
   ~~~
   npx uses the `@reframe/cli` locally installed at `my-react-frontend/node_modules/@reframe/cli`.
   <br/><br/>
   </details>

2. Create a new app with the `react-frontend` starter:
   ~~~shell
   $ reframe create react-frontend
   ~~~

3. Build and serve the app:
   ~~~shell
   $ cd my-react-frontend/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. Read [Usage Manual - Basics](/docs/usage-manual.md#basics).

> The
> [react-frontend](/plugins/create/starters/react-frontend#readme).
> starter scaffolds a static site.
> There are other starters to scaffold
> a SSR app, a backend-only app, a full-stack app, etc.
> See [Starters](/docs/starters.md#readme).

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>





## Example

Showcase of a database + server + frontend stack.

If you are interested in other stacks then see
[/examples](/examples).

Let's create our app.
First, we define our data models with
[Objection.js](https://github.com/Vincit/objection.js):

~~~js
const {Model} = require('objection');

class Person extends Model {
  static tableName = 'persons';
  static jsonSchema = {
    properties: {
      id: {type: 'integer'},
      name: {type: 'string'},
    },
  };
}

module.exports = Person;
~~~
~~~js
const {Model} = require('objection');

class Animal extends Model {
  static tableName = 'animals';
  static jsonSchema = {
    properties: {
      id: {type: 'integer'},
      name: {type: 'string'},
      ownerId: {type: 'integer'},
    },
  };
}

module.exports = Animal;
~~~

Then, we create an API with [Wildcard API](https://github.com/brillout/wildcard-api#readme):
~~~js
const {endpoints} = require('wildcard-api');
const Person = require('../db/models/Person');
const Animal = require('../db/models/Animal');

// We create an API endpoint to retrieve all the data that our PetsPage need.

// The `getPetsPageData` endpoint is tailored to our frontend:
// It returns exactly and only what PetsPage needs.
// We deliberately choose a custom API over a generic API (REST/GraphQL).

endpoints.getPetsPageData = async function(personId) {
  const person = await Person.query().findOne('id', personId);
  const pets = await Animal.query().where('ownerId', personId);
  return {person, pets};
};
~~~

Finally, we create `PetsPage`, a page to view a person's pets:
~~~jsx
import React from 'react';
import {endpoints} from 'wildcard-api/client';

export default {
  route: '/pets/:personId',
  view: Pets,
  getInitialProps,
};

function Pets({person, pets}) {
  return (
    <div>
      {person.name}'s pets:
      { pets.map(pet =>
        <div key={pet.id}>{pet.name}</div>
      ) }
    </div>
  );
}

async function getInitialProps({personId}) {
  const {person, pets} = await endpoints.getPetsPageData(personId);
  return {person, pets};
}
~~~

That's it:
No build configuration,
no server configuration,
no API schema.
(But if you want, you can eject and take control over everything.)

Use the [react-sql](/plugins/create/starters/react-sql#readme)
starter to scaffold such Reframe + Objection + Wildcard API stack.

<b><sub><a href="#contents">&#8679; TOP  &#8679;</a></sub></b>

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
