<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.






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
<p align='center'></p>
&nbsp;

# react-app

Starter to create a web app with:
 - React frontend
 - Node.js server

For other starters, see the [list of starters](/docs/starters.md).

- [Quick Start](#quick-start)
- Usage Basics
  - Frontend
    - [CSS & Static Assets](#css--static-assets)
    - [Page Async Data](#page-async-data)
    - [`doNotRenderInBrowser`](#donotrenderinbrowser)
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
   Alternatively with yarn:
   ~~~shell
   $ yarn global add @reframe/cli
   ~~~

2. Create a new Reframe app.
   ~~~shell
   $ reframe create react-app
   ~~~
   A `my-react-app/` directory is created and populated with the react-app starter.

3. Build and serve the app.
   ~~~shell
   $ cd my-frontend-app/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. **Read the entire [Usage Basics](#react-app) section**.

For further usage information, lookup the [Usage Manual](/docs/usage-manual.md).

<b><sub><a href="#react-app">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>




#### Usage Basics

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

Example of a page using CSS, fonts, images and other static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-app">&#8679; TOP  &#8679;</a></sub></b>
<br/>
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

    doNotRenderInBrowser: true,
};
~~~

Alternatively, you can fetch data in a stateful component.
But in that case the data will not be rendered to HTML.

Deeper explanation and further examples of pages asynchronously loading data:
 - [/examples/basics/pages/got/](/examples/basics/pages/got/)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-app">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## `doNotRenderInBrowser`

The page config option `doNotRenderInBrowser` allow you to control whether or not the page is rendered in the browser.

By default a page is rendered in the browser so that it can have interactive views
(a like button, an interactive graph, a To-Do list, etc.).
But if a page has no interactive views then it is wasteful to render it in the browser.

 - `doNotRenderInBrowser: false` (default value)
   <br/>
   The page is **rendered in the browser**.
   <br/>
   The page's view (e.g. React components) and the view renderer (e.g. React) are loaded in the browser.
   <br/>
   The page's view is rendered to the DOM.
   (E.g. with `ReactDOM.hydrate`.)
   <br/>
   The DOM may change.
 - `doNotRenderInBrowser: true`
   <br/>
   The page is **not rendered in the browser**.
   <br/>
   No JavaScript (or much less JavaScript) is loaded in the browser.
   <br/>
   The DOM will not change.

Setting `doNotRenderInBrowser: true` makes the page considerably faster as no (or much less) JavaScript is loaded and exectued.

So if your page has no interactive views, then you should set `doNotRenderInBrowser: true`.
More precisely, you should set `doNotRenderInBrowser: true` if your page's view is stateless.
E.g. a functional React component is always stateless and non-interactive.
So if your page's view is composed of functional React components only, then you should set `doNotRenderInBrowser: true`.

<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-app">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## Custom Server Framework (Express, Koa, ...)

Check the [list of plugins](/docs/plugins.md) for a plugin that integrates the server framework you want to use with Reframe.
You can then get control over the server instance by runnning `$ reframe eject server`.

If there isn't a plugin for the server framework you want, then run
- `$ reframe eject server`
- `$ reframe eject server-integration`
to get full control over the integration of the current server framework and Reframe.
At that point you can get rid of the current server framework and replace it any other server framework.
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-app">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>




## Deploy

If your app is stateless then we recommand serverless deployment.

Serverless deployment solutions:
 - [Up](https://github.com/apex/up) - CLI tool to manage serverless deployement on AWS.
   <br/>
   The free tier is generous and will likely be enough for your first prototype.
   <br/>
   Step-by-step guide on how to deploy a Reframe app on Up: [github.com/AurelienLourot/reframe-on-up](https://github.com/AurelienLourot/reframe-on-up).
 - [Now](https://zeit.co/now) - Serverless host.
   <br/>
   The free tier doesn't support custom domains. (See [zeit.co/pricing](https://zeit.co/pricing).)


If you want to persist data, you may consider using a cloud database.
 - [List of cloud databases](/docs/cloud-databases.md)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-app">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>





<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-app/readme.template.md` instead.






-->
