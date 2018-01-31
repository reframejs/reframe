!INLINE ./logo.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

# Overview

##### Contents

 - [What is Reframe?](#what-is-reframe)
 - [Why Reframe?](#why-reframe)
 - [Reframe VS Next.js](#reframe-vs-next.js)
 - [Reframe Project Scope](#reframe-project-scope)
 - [Reframe Alternatives](#reframe-alternatives)
 - [Quick Start](#quick-start)


### What is Reframe?

Reframe allows you to create apps by simply defining
 - React components, and
 - so-called "page objects"

The rest is taken care for you; Reframe automatically transpiles, bundles and serves your pages.

With page objects, you can easily create universal react apps (also called isomorphic apps), static react apps, and other types of react apps.

*Page objects* are JavaScript objects like this:

~~~js
// ~/tmp/reframe-playground/pages/HelloPage.html.js

!INLINE ../example/pages/HelloPage.html.js --hide-source-path
~~~

Running the `reframe` CLI takes care of the rest.


### Why Reframe?

Reframe has been designed with following focus (in order):
 1. Ease of Use
 2. Full Customization
 3. Performance

##### Ease of Use

Creating a page is simply a matter of creating a JavaScript object and a React component.

See the Quick Start section bellow to see how easy it is to create a page with a server-rendered React component.


#### Full Customization

Reframe 
Reframe's default setup is minimalisic so that .

Beyond 
Although Reframe's basic usage has been designed to be as easy as possible, you can fully Reframe 

To further push the evenlop,

Reframe consists of three
has been designed so that every Reframe LOC can be replaced with custom code.

Reframe consists of three packages:
`@reframe/build` (transpilation and bundling),
`@reframe/server` (server), (hydration).
Each of these packages can be replaced with code of your own.
That means that as your 

That way, you can create a and as your app matures and crystalizes


This means that everything 
For more information, see the Customization manual
Reframe consists of 3 parts 


With Reframe and break out of Reframe's lock-in down the road.
considerably reduced

Reframe is born out of two conflicting intentions:

 - I want to use a framework to quickly implement a prototype.
   I don't want to design an entire app architecture before even starting to write one line of code.

 - I don't want to use a framework because of the framework's limitations.
   And more importantly, I don't want to get locked into that framework down the road.

Upon this conflict, the question arises:

 > Is it possible to design a framework that allows its user to quickly implement a prototype without locking the user in?

Reframe is born out of the belief that it is.

Reframe is designed so that its parts can be overwritten.
This means that, if Reframe doesn't suit a need, you can replace Reframe parts with code of your own to adapt Reframe to your need.
You can progressively and over time re-write all Reframe parts and get rid of Reframe altogether.

We call the characteristic of being able to adapt to your needs *adaptability*,
and we call such adaptable framework an *(anti-)framework*.


##### The future of React is SSR

I've seen seen all too often.

**If you page doesn't need to be dynamic, then it shouldn't**. The truth is, dynamic pages are difficult by nature, and not matter how much better our tooling will become, dynamic pages will remain considerably more complex then static pages.

Every usage signal; React popularity is steadly increasing and not stopping. 

Why not use Ruby on Rails, Django, or Flask instead of React then? Because
 1. React/JSX is a vastly superior HTML templating engine.
 1. React/JSX is an incredibly powerful HTML templating engine.
 It is vastly superior to previous declarative template engines.

 2. 
 3. One language for both the browser and the server.
 3. WebAssembly means that you can quickely implement prototypes with a script language and have great performence with a GC-less statically-typed language.
 4. WebAssembly means that you'll eventually be able to choose amongst a high variety of languages while 

**Even if all your pages aren't dynamic, React is still the right choice**.

**Reframe embraces this future and allows you to JavaScript-less pages.**

At the cornerstore of this is the concept of We call such page a *HTML-static* and *DOM-static* page, and the Usage Manual explains (Switching is a matter of change 1 line)

##### A more reasonable approach to dynamic pages

With Reframe you can defined so-called HTML-static and DOM-static pages.
Such pages are rendered to HTML on build-time and don't load any JavaScript.

Your about page, your landing page, your homepage probably don't need to be dynamic, don't need .
You can still include small JavaScript code such as Google Anayltics.
But really, if one of your pages doesn't strictly need to be dynamic, then it shouldn't.

React ; If you don't.

It's not SSR React that is hard to implement, it's actually browser React the difficult.


##### Features

##### Customizable

And Reframe is customizable:
custom webpack config,
custom browser entry,
custom build tool such as Rollup,
custom hapi server config,
custom server framework such as Express,
custom routing library other than Crossroads.js,
custom React integration,
custom view library such as Preact,
etc.


##### Performance

- Code splitting
  -
  - ES6's import works out of the box

Optimal HTTP Caching

# Features

 - auto reload

 - Fully
 - Performant
  - Code splitting
  - HTML-static pages
  - DOM-static pages
  - Optimal HTTP Caching


<br/>

### Reframe VS Next.js

The main problem with Next.js, is that
 1. using Next.js feels like having tied hands, and
 2. Next.js doesn't embrace the trend of using React predominantly on the server.

About 1:
Next.js works well if you comply with its design decisions, but if you don't, you are in for trouble.
For example, Next's webpack customization is broken (in parts because Next.js doesn't do universal webpack) which leads to no support for typescript, PostCSS, SASS, etc.

About 2:
Next.js doesn't allow you to create pages that load the minimum amount of JavaScript.
But React is more and more used in a server-rendering-only fashion; See the "The future of React is SSR".

Beyond that, Next.js lacks in ease of use. (Next.js's routing is a big hassle, server cusomtization is a hassle, static apps are cumbersome, etc.)

Still, Next.js is awesome because it made creating a simple app easier.
But it kind of feels like AngularJS; AngularJS was awesome because it made but it always felt messy and wrong.
In short, Next.js could use some healt





### Reframe Project Scope

All types of apps can be created with Reframe, whether it be a universal app, or a static app, or an with a combination of static and dynamic pages.

That's because you can configure as "HTML-static


When creating an app with Reframe takes care:

 - **Build**
   <br/>
   Transpiles and bundles your frontend assets. (Uses webpack.)
 - **Server**
   <br/>
   Sets up a Node.js server that serves dynamic HTMLs and static assets. (Uses hapi.)
 - **Routing**
   <br/>
   Maps URLs to pages.

Reframe **doesn't** take care of:

 - View logic / state management.
   <br/>
   It's up to you to manage the state of your views. (Or use Redux / MobX / [Reprop](https://github.com/brillout/reprop).)
 - Database.
   <br/>
   It's up to you to create, populate, and query databases.


### Reframe Alternatives

The exhaustive list of frameworks/tools (scaffolds not included) that help create server-rendered React apps:
 - [Next.js](https://github.com/zeit/next.js)
 - [Razzle](https://github.com/jaredpalmer/razzle)
 - [After.js](https://github.com/jaredpalmer/after.js)

Make a PR if something is missing in the list.
(Gatsby is for static apps only, Create React App is a scaffold.)

### Quick Start

Let's define a page.
For that we will create a page object and a React component.

1. We first create a `pages/` directory:

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~


2. We then create a new JavaScript file `~/tmp/reframe-playground/pages/HelloPage.html.js` that exports a page object:

~~~js
import React from 'react';

const HelloWorldPage = {
    route: '/',
    view: () => (
        <div>
            Hello World, from Reframe.
        </div>
    ),
};
export default HelloWorldPage;
~~~

3. We install Reframe's CLI and React:

~~~shell
npm install -g @reframe/cli
~~~
~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
npm install react
~~~

4. Finally, We run the CLI:

~~~shell
cd ~/tmp/reframe-playground/
~~~
~~~shell
reframe
~~~

which prints

~~~shell
$ reframe ~/tmp/reframe-playground/pages
✔ Page directory found at ~/tmp/reframe-playground/pages
✔ Frontend built at ~/tmp/reframe-playground/dist/browser/ [DEV]
✔ Server running at http://localhost:3000
~~~

That's it, we have created our first page. You now know 50% for using Reframe's default setup.

For further information, see The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains.
