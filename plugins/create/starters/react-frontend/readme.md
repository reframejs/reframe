<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.






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

# react-frontend

Starter to create a React frontend.

Choose this starter if you don't need a backend or if you already have one.

If you are not sure if you need a Node.js server, that's fine:
You can use the react-frontend starter and easily add a Node.js server afterwards.

For other starters, see the [list of starters](/docs/starters.md#readme).

- [Quick Start](#quick-start)
- Usage Basics
  - [Deploy](#deploy)
  - [CSS & Static Assets](#css--static-assets)
  - [Page Async Data](#page-async-data)
  - [`doNotRenderInBrowser`](#donotrenderinbrowser)

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
   $ reframe create react-frontend
   ~~~
   A `my-react-frontend/` directory is created and populated with the react-frontend starter.

3. Build and serve the app.
   ~~~shell
   $ cd my-frontend-app/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. **Read the entire [Usage Basics](#react-frontend) section**.

For further usage information, lookup the [Usage Manual](/docs/usage-manual.md).

<b><sub><a href="#react-frontend">&#8679; TOP  &#8679;</a></sub></b>

<br/>
<br/>




#### Usage Basics

## Deploy

Run `$ reframe deploy` to automatically deploy your app.

The deploy command works with any static host that integrates with Git such as
[Netlify](https://www.netlify.com/) (recommanded) or
[GitHub Pages](https://pages.github.com/).

If you want to manually deploy then simply copy/serve the `dist/browser/` directory.
This directory contains all browser assets.
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-frontend">&#8679; TOP  &#8679;</a></sub></b>
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

Example of a page using CSS, fonts, images and other static assets:
 - [/examples/basics/pages/glitter/](/examples/basics/pages/glitter/)
<br/>

In doubt [open a GitHub issue](https://github.com/reframejs/reframe/issues/new) or [chat with Reframe authors on Discord](https://discord.gg/kqXf65G).
<br/>
<br/>
<b><sub><a href="#react-frontend">&#8679; TOP  &#8679;</a></sub></b>
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
<b><sub><a href="#react-frontend">&#8679; TOP  &#8679;</a></sub></b>
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
<b><sub><a href="#react-frontend">&#8679; TOP  &#8679;</a></sub></b>
<br/>
<br/>
<br/>





<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/create/starters/react-frontend/readme.template.md` instead.






-->
