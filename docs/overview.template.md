!INLINE ./logo.md --hide-source-path

!MENU
!OUTPUT ../readme.md
!MENU_LINK /../../
!MENU_ORDER 10

# Overview

##### Contents

 - [What is Reframe](#what-is-reframe)
 - [Why Reframe](#why-reframe)
 - [The React Future](#the-future-of-react)
 - [Reframe Project Scope](#reframe-project-scope)
 - [Reframe VS Next.js](#reframe-vs-next.js)
 - [List of SSR tools](#reframe-alternatives)
 - [Quick Start](#quick-start)


### What is Reframe

Reframe allows you to create a web app by defining pages.
Reframe then takes care of the rest: It automatically transpiles, bundles, serves, and routes your pages.

A page is defined by a plain JavaScript object called *page config*.

~~~js
// We create a landing page by defining a page config `LandingPage`:
const LandingPage = {
    route: '/', // Page's URL
    view: () => <div>Welcome to Reframe</div>, // Page's root React component
    title: 'Welcome' // Page's <title>
};
~~~

A page config configures a page by assigning it
 - a React component (required),
 - a route (required), and
 - further (optional) page configurations (such as the page's &lt;title&gt;, meta tags, script tags, whether the page should by hydrated or not, whether the page's HTML should be rendered at build-time or at request-time, etc.).

You can build a React web app with **no build configuration** and **no server configuration**.
**All you need to create a web app is one React component and one page config per page.**
But **everything is customizable**, if you need to.
You can customize the transpiling & bundling, the server, the browser entry, the Node.js entry, etc.

By defining page configs you can easily create:

 - **Server-side rendered React apps**
 <br/>
 Apps where pages are rendered to HTML on the server at request-time.

 - **HTML-static React apps**
 <br/>
 Apps where all pages are rendered to HTML at build-time.
 These apps don't need a Node.js server and can be deployed to a static website hosting such as GitHub Pages or Netlify.

 - **DOM-static React apps**
 <br/>
 Apps where the DOM is static and React is only used to render HTML.
 No (or almost no) JavaScript is loaded in the browser.

 - **Every kind of React app**
 <br/>
 Pretty much all kinds of app can be created.
 Reframe generates a certain type of app depending on how you configure your pages.
 For example, if you add `htmlIsStatic: true` to a page config, then that page's HTML is rendered at build-time instead of request-time.
 So, creating an HTML-static React app is simply a matter of setting `htmlIsStatic: true` to all page configs.
 An app can be a mix: Some pages can be HTML-static, some HTML-dynamic, some DOM-static, and some DOM-dynamic.

Reframe supports a high varitety of app types you can choose from by simply configurating your page configs.

In the following we create a web app by defining one page config `HelloPage`.

~~~js
// ~/tmp/reframe-playground/pages/HelloPage.html.js

!INLINE ../example/pages/HelloPage.html.js --hide-source-path
~~~

The `reframe` CLI does the rest:

<p align="center">
    <img src='https://gitlab.com/brillout/reframe/raw/master/docs/screenshots/reframe_overview_screenshot.png' width=1200 style="max-width:100%;"/>
</p>

### Why Reframe

Reframe has been designed with a focus on
 - Ease of Use
 - Universality
 - Customization
 - Performance

##### Ease of Use

Creating a React app is simply a matter of creating React components and page configs.
The "Quick Start" section bellow shows how easy it is.

#### Universality

When React came out in 2013, it was predominantly used for the browser / the DOM.
Nowadays, it is more and more used to generate HTML.
We expect this trend to considerably increase:
React will increasingly be used for any kind of app that involves a UI,
becoming the de-facto universal view library.
The section "The React Future" provides a rationale for that trend.

Reframe embraces this future by supporting pretty much every type of web apps.

Let's imagine for example that we want to create a web app where 95% of the app's content shown to the user is not interactive.
In other words, 95% of the DOM is static.
To implement our 95% DOM-static part,
it would seem natural to use a DOM-static framework such as RoR or Django and use React for our DOM-dynamic parts.
But, as explained in the section "The React Future", it actually makes sense to use React for everything, even for the 95% static part of the app.
Reframe allows you to create such 95% DOM-static app today.

In short, no matter what type of web app you want, you can use Reframe to quickly get started.


#### Customization

Reframe's basic usage is designed to be as easy as possible.
But Reframe also supports customization.
Many customization are easy to achieve.
Also, Reframe allows "full customization": virtually everything is customizable.

Examples of customizations that are easy to achieve:
 - Custom server
   - Add server routes to create RESTful/GraphQL API endpoints, authentication endpoints, etc.
   - Custom hapi server config (Reframe uses the hapi server framework by default)
   - Use a process manager such as PM2
   - etc.
 - Custom browser JavaScript
   - Add error logging, analytics logging, etc.
   - Full control of the hydration process
   - etc.
 - Custom transpiling & bundling
   - Reframe can be used with almost any webpack config. (Reframe assumes pretty much nothing about the webpack config.)
   - TypeScript support
   - CSS preprocessors support, such as PostCSS, SASS, etc.
   - etc.
 - Custom routing library (Reframe uses Crossroads.js by default)
 - Custom view library such as Preact
 - etc.

Beyond these easy customizations,
Reframe is designed with "full customization" in mind:
Reframe consists of three packages
(`@reframe/build` that transpiles and bundles, `@reframe/server` that creates the server, `@reframe/browser` that hydrates the page in the browser)
and each of these packages can be replaced with code of your own.
This means that, if you replace all these three packages with your own code, you effectively get rid of Reframe.

Some examples of customization achievable by replacing Reframe packages:
 - Custom server framework, such as Express, Koa, etc. (Reframe uses hapi by default)
 - Custom build tool, such as Rollup (Reframe uses webpack by default)
 - etc.



### The future of React

> **TL;DR**
> React is increasingly going to be used for apps that are (mostly) DOM-static.
> React may very well become the de-facto universal view library 
> Reframe encourages and supports apps with increasong amount of DOM-static parts

###### React and non-interactive views

React is more and more used to create static apps.
This trend may sound odd at first as React is a library for creating views that are interactive.

Why would we use React to create a view that is static?

Let's imagine a software engineering team that wants to implement a web app where no page is interactive.
In other words the DOM is never manipulated -- the web app is DOM-static.
What platform should the team use?
It would seem natural to choose a platform regardless of its support for interactive views.
The team could for example use Ruby on Rails despite the fact RoR doesn't direclty support for interactive views.
That would be a legitimate choice if the team knows that it won't have to implement interactive views in the future.
And that's the twist;
It is likely that at some point a new project (requirement) will require DOM-dynamic page(s).
At this point the dev team will have no choice than to acquire knowledge about JavaScript and a view library such as React.
If the team would have chosen Node & React instead, they would have spared themselves the time to learn a new platform.

> With React, you can learn one API to be able to write views for all kinds of views (DOM, HTML, native, etc.)

This is a powerful proposition that only JavaScript & React can offer.

In general JavaScript & React has strong advantages

 - React can create interactive views
 - JavaScript, which is a popular, portabe, performant, and rapidly evolving language.
 - WebAssembly may very well become the universal runtine
 - Thanks to WebAssembly you'll be able to use React with high variety of languages


###### Reframe encourages DOM-static views

Another trend in web development is to make views interactive only if necessary.
In the past, we had the tendency to jump on the interactive views bandwagon too easily.
Over time, we learned that interactive views are, by nature, significantly more difficult to implement than static views.

> Views should be made interactive only if necessary

Interactive views are perfectly fine, it's just that they are more time consuming to implement.
Reframe embraces both interactive views and static views but encourages you to choose static views when possible.

> Reframes treast both interactive views and static views as first-class citizens.

Beyond static views being easier to implement than dynamic views, they also are more performant as no 



> If your page can be made non-interactive, then make it non-interactive

In 2017, React reached the highest satisfaction rate among view libraries (https://stateofjs.com/2017/front-end/results).
And as state management 

highset 

Atwood's Law: any application that can be written in JavaScript, will eventually be written in JavaScript.

> Any application that can be written with React, will eventually be written with React.


Beyond the fact that React's capability to create views that are interactive, 



> **TL;DR**
> - Pages that have a DOM that is (mostly) static are easier to build and are more performant.
> - Reframe supports and encourages the creation of such (mostly-)DOM-static pages.
> - Reframe will eventually
> - A web app framework on eye-level with RoR / Django based on JavaScript and React will soon emerge.


In short, React may very well become the de-facto view library when creating any application that involves a UI.










Would be want to use JavaScript & React to create such DOM-static web app?
Maybe not, as React is a tool for creating interactive views.
Instead we could
If the company only and will only will always have projects DOM-static web apps,
But this is unlikely and chances are high that at some point a new project or new project requirement will require DOM-dynamic page(s).
At this point the dev team will have no choice than to acquire knowledge about JavaScript and a view library such as React.

The problem would not have occured, if the dev team would have chosen React and JavaScript.

But there is a problem: Implementing a web app solely with JavaScript and React is currently overly effortful.
These days, it is easier to implement a DOM-static web app with Ruby on Rails (RoR) than with JavaScript & React.
But this is changing.
The reason that RoR is easier is not because of the Ruby language nor because of RoR's template engine.
It's because of RoR itself, the framework.
JavaScript & React are missing a framework and Reframe aims to be that framework.

**Soon JavaScript & React will get a framework at eye-level with RoR. At that point, there will be virtually no reason to choose RoR over JavaScript & React. Reframe aims to be that framework.**



> - Reframe allows the creation of web apps that are mostly DOM-dynamic as well as web apps that are mostly DOM-static.


There may be JavaScript fatigue, but JavaScript and React are not going anywhere and their popularity and adoption are only increasing.

Likewise, on a career level, learning JavaScript and React is a robust choice.




JavaScript & React is more difficult is because
But this is because no high-quality web app framework using React has emerged yet.
Reframe aims to fill the gap.


On the other, and even if we don't manipulate the DOM, React is still a great templating engine to generate HTML.
With React, we can create JavaScript's expressivness to define views, which is quite neat and superior to declarative template engines.

But more importantly, if it does happen that some page enventually need.
With Reframe, adding interactivity to a DOM-static page  is a matter of only a couple of lines of code.

Also, JavaScript is one of the most popular language, relatively easy and performant

great for static views as well.
, would you use React
Imagine you 

React is not only a great library to implement dynamic views,
but it is also a great templating engine.
A React component is universal:
It describes a view
that can be static or dynamic, and
that can be rendered to the DOM or to HTML or even to native iOS/Android.
No other templating engine is that universal.
And using the expressivness of JavaScript to define React components is vastly more powerful than any declarative template engines.



WebAssembly has the potential to be what Java and .NET have both tried and failed to be -- the universal runtime for all languages across all platforms.

We predict that React will become the de-facto templating engine.

Even if you don't 
Even if none of yours pages

Hacker news has almost no interactive.
React's popularity is increasing and is becoming the de-facto, similar to (Vue.js is great but it does a poor job on the server.)
React in itself is a near-optimal experience; It does only one thing and does it very well.
The problem with React is that 
The only problem but the ecosystem around React is still young.
But this is changing and Reframe is contributing.

Reframe's vision is that learning JavaScript and React will be enough to build a full-stack application.

With *SRO* 

**If your page doesn't need to be interactive, then it shouldn't**.
Pages that dynamically change in the browser.
Dynamic pages are difficult by nature, and not matter how much better our tooling will become, dynamic pages will remain considerably more complex then static pages.

Every usage signal; React popularity is steadly increasing and not stopping. 

Why not use Ruby on Rails, Django, or Flask instead of React then? Because
 1. React/JSX is a vastly superior HTML templating engine.
 1. React/JSX is an incredibly powerful HTML templating engine.
 It is vastly superior to previous 

 2. 
 3. One language for both the browser and the server.
 3. WebAssembly means that you can quickely implement prototypes with a script language and have great performence with a GC-less statically-typed language.
 4. WebAssembly means that you'll eventually be able to choose amongst a high variety of languages while 


Website cooking recipes with AMP
Still worth it because
 - Reuse the whole React & Reframe ecosystem
 -

React is popular:
 - https://stateofjs.com/2017/front-end/results
  - 90% say they would use React again. Even though the tooling around React is still very young and immature.
 - more interestingly is everytime I talk to people about React what strikes me the level of enthusiam. I've never seen such repeated enthusiam for a programming library before.

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

It's not SRO React that is hard to implement, it's actually browser React the difficult.


##### Performance

- SSR.
  <br/>
  All pages are rendered to HTML, which considerably decreases the perceived load time.
- Code splitting.
  <br/>
  Every page loads two scripts:
  A script shared and cached accross all pages that include common code such as React and polyfills,
  and a script that is specific to the page,
  which is typically lightweight.
  This means that if a page requires KB-heavy libraries that won't affect the KB-size of other pages.
- Optimal HTTP Caching.
  <br/>
  Every dynamic server response is cached with a Etag header, and
  every static server response is indefinitely cached.
  (By assigning the static asset to a hashed URL, and by setting the `Cache-Control` header to `immutable` and `max-age`'s maxium value.)
- Pages that load a minimal amount of browser-side JavaScript
- DOM-static pages.
  <br/>
  A page can be configured to be rendered only on the server.
  This as React is not loaded in the browser and the page doesn't need to be hydrated.
  Also, a page can be configured so that only parts are hydrated.
- HTML-static pages.
  <br/>
  A page can be configured to be rendered to HTML at build-time instead of request-time.
  This means that, the page is rendered only once to HTML when Reframe is transpiling and bundling and the the HTML is statically served.



### Reframe VS Next.js

On a high-level, Next.js's main problem is that

 1. Using Next.js feels like having tied hands.
    <br/>
    Next.js works well if you comply with its design decisions but you are in for trouble if you don't.
    For example, Next.js's webpack customization is broken which leads to no support for typescript, PostCSS, SASS, etc.

 2. Next.js only supports other types of apps beyond universal
    <br/>
    Next.js supports only two types of apps: universal apps (where the entire page is rendered to HTML at request-time and hydrated in the browser) and static apps (where all pages are rendered to HTML at build-time).
    But React allows a higher variety of applications that . All of them are not supported by Next.js. Hybrid dynamic static apps
    Reframe supports every type of React apps.

 3. Next.js doesn't embrace the future
    <br/>
    Next.js's focus is limited to universal and static apps, yet more and more React applications will implement hybrid apps that have a mix of DOM-static pages, DOM-dynamic pages, HTML-static pages and HTML-dynamic pages.
    Furthermore, Next.js's team don't show interest in topis such as state management, view logic management, database integration, ORM, Asynchronous tasks, CMS, etc.
    Reframe strives to expand in these areas.



About 1:
(mainly because in parts because Next.js doesn't do universal webpack)

About 2:
Next.js doesn't allow you to create pages that load the minimum amount of JavaScript.
But React is more and more used in a server-rendering-only fashion; See the "The future of React is SRO".

On a low-level, Next.js lacks in terms of ease of use, performance and security:
 - Next.js's routing is a big hassle
 - Server customization is a hassle
 - The creation of static apps is uncesseray complicated
   <br>
   In contrast, with Reframe static apps are just a matter of setting `htmlIsStatic: true` to every page config and the whole developing experience stays the same.
 - Customization of browser JavaScript is not possible for things such as error tracking
 - No typescript support (The
 - No support for third party code integration such as error tracking, google analytics, etc. (Next.js doesn't allow you to control 
 - No
 - No support for [AMP](https://www.ampproject.org/)
 - Security issues. [Easy](https://github.com/zeit/next.js/blob/33f8f282099cb34db2c405aabb883af836d6dc2a/test/integration/production/test/security.js)





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


### List of SSR tools

The exhaustive list of frameworks/tools (scaffolds not included) that help create server-rendered React apps:

###### Frameworks

 - [Next.js](https://github.com/zeit/next.js)
 - [After.js](https://github.com/jaredpalmer/after.js)

###### Libraries

 - [Razzle](https://github.com/jaredpalmer/razzle)
 - [Universal Router](https://github.com/kriasoft/universal-router)

Make a PR if something is missing in the list.
(Gatsby is for static apps only, Create React App is a scaffold.)

### Quick Start

Let's create our first React app.
For that we will create a page by defining a page config and a React component.

1. We first create a `pages/` directory:

~~~shell
mkdir -p ~/tmp/reframe-playground/pages
~~~


2. We then create a new JavaScript file `~/tmp/reframe-playground/pages/HelloPage.html.js` that exports a page config:

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

What happens here

 - Reframe searches for the `/pages` directory and finds it at `~/tmp/reframe-playground/pages`
 - Reframe reads the `/pages` directory and finds our page config at `~/tmp/reframe-playground/pages/HelloPage.html.js`
 - Reframe uses webpack to transpile `HelloPage.html.js` and to create two bundles for the browser: one bundle shared- and another bundle specific to `HelloPage` that will only be loaded when navigating to a URL matching our `HelloPage` page's route `/hello/{name}`.
 - Reframe starts a hapi server serving all static browser assets and serving the dynamically HTML generated 

That's it:
We have created our first React web app with only one React Component and one page config.

The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains further information for:
 //- Creating a server-rendered app
 - Loading async data
 - Creating a static app
