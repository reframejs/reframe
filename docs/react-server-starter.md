<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.






-->
<a href="https://github.com/reframejs/reframe">
    <img align="left" src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title.min.svg?sanitize=true" width=399 height=79 style="max-width:100%;" alt="Reframe"/>
</a>
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

&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Overview](/../../)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Starters: [**React Server**](/docs/react-server-starter.md) | [React Frontend](/docs/react-frontend-starter.md) | [React Database](/docs/react-database-starter.md)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Usage Manual](/docs/usage-manual.md)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Concepts](/docs/concepts.md)<br/>
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; [Plugins](/docs/plugins.md)

<br/>

# React Server

Starter to create a web app with:
 - React front-end
 - Node.js server

For other starters, see the [list of starters](/../../#getting-started).

- [Quick Start](#quick-start)
- Usage Basics
  - Frontend
    - [Page Async Data](#page-async-data)<br>
    - [CSS & Static Assets](#css--static-assets)<br>
    - [`doNotRenderInBrowser`](doNotRenderInBrowser)
  - Server
    - [Custom Server Framework (Express, Koa, ...)](#custom-server-framework-express-koa-)
  - [Deploy](#deploy)

<br/>
<br/>

## Quick Start

1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~

2. Initialize a new Rreframe app.
   ~~~shell
   $ reframe init react-server my-app
   ~~~
   A `my-app/` directory is created and populated with a scaffold.

3. Build the pages and start the server.
   ~~~shell
   $ cd my-app
   $ reframe start
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. **Read the entire [Usage Basics](#react-server) section** and lookup the usage manual for further usage information.

<b><sub><a href="#react-server">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>




## Page Async Data

The page config `async getInitialProps()` can be used to fetch data before your page's view is rendered.
The value returned by `async getInitialProps()` is then available to your page's view.

For example:

~~~js
// /examples/basics/pages/got/GameOfThronesPage.config.js

import React from 'react';
import getCharacters from './data/getCharacters';
import CharacterList from './views/CharacterList';

export default {
    route: '/game-of-thrones',

    // Everything returned in `getInitialProps()` is passed to the props of the view
    getInitialProps: async () => {
        const characters = await getCharacters();
        return {characters};
    },

    // Our data is available at `props.characters`
    view: props => <CharacterList characters={props.characters}/>,

    domStatic: true,
};
~~~

Alternatively, you can fetch data in a stateful component.
But in that case the data will not be rendered to HTML.

Deeper explanation and example of pages loading data:
 - [/examples/basics/pages/got/](/examples/basics/pages/got/)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-server">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>





## CSS & Static Assets

A CSS file can be loaded and applied by importing it.

~~~js
import './GlitterStyle.css';
~~~

Static assets (images, fonts, videos, etc.) can be imported as well
but importing an asset doesn't actually load it:
Only the URL of the asset is returned.
It is up to us to use/fetch the URL of the asset.

~~~js
import diamondUrl from './diamond.png';

// do something with diamondUrl, e.g. `await fetch(diamondUrl)` or `<img src={diamondUrl}/>`
~~~

In addition, static assets can be referenced in CSS by using the `url` data type.

~~~css
.diamond-background {
    background-image: url('./diamond.png');
}
~~~

Example of a page loading and using CSS, fonts, images and static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-server">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## `doNotRenderInBrowser`

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-server">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## Custom Server Framework (Express, Koa, ...)

First, check the [list of plugins](/docs/plugins.md) for a plugin that integrates the server framework you want to use with Reframe.
If you then want to get control over the server instance, then run `$ reframe eject server`. (See previous section)

If there isn't a plugin for the server framework you want, then run
- `$ reframe eject server`
- `$ reframe eject server-integration`
to get full control over the integration of the current server framework and Reframe.
At that point you can get rid of the current server framework and replace it any other server framework.
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-server">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## Deploy

If your app is stateless we then recommand serverless deployment.

Serverless deployment solutions:
 - [Up](https://github.com/apex/up) - CLI tool to manage serverless deployement on AWS.
 - [Now](https://zeit.co/now) - Serverless host.

A step-by-step guide on how to deploy a Reframe app on Up can be found [here](https://github.com/AurelienLourot/reframe-on-up).

If you want to persist data, you may consider using a cloud database.
 - [List of cloud databases](/docs/cloud-databases.md)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-server">&#8679; TOP &#8679;</a></sub></b>
<br/>
<br/>
<br/>






<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/react-server-starter.template.md` instead.






-->
