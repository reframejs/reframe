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
<p align="center">
    [<img src='https://github.com/brillout/reframe/raw/master/docs/logo/logo-with-title.svg?sanitize=true' width=450 height=94 style="max-width:100%;" alt="Reframe"/>](https://github.com/brillout/reframe)
</p>
<p align="center">
    Framework to create server-rendered React apps. Easy to use yet fully customizable.
</p>
<br/>

[Overview](/../../)<br/>
[Usage Manual](/docs/usage-manual.md)<br/>
[Customization Manual](/docs/customization-manual.md)

# Overview

##### Contents

 - [What is Reframe?](#what-is-reframe)
 - [Why Reframe?](#why-reframe)
 - [The future of React is SRO](#the-future-of-react-is-sro)
 - [Reframe Project Scope](#reframe-project-scope)
 - [Reframe VS Next.js](#reframe-vs-next.js)
 - [Reframe Alternatives](#reframe-alternatives)
 - [Quick Start](#quick-start)


### What is Reframe?

Reframe allows you to create apps by simply defining pages with
 - a React component, and
 - a *page object*, which is a JavaScript object that defines the page.

Reframe takes care of the rest; It automatically transpiles, bundles and serves your pages.

With Reframe, you can easily create
 - universal react apps (in other words apps with server-side rendering),
 - static react apps (in other words apps where all pages' HTML are rendered at build-time), and
 - other kinds of react apps (mainly "browser-static apps" and "partial dynamic apps" which we will in the "The future of React is SRO" section).

A page object looks like this:

~~~js
// ~/tmp/reframe-playground/pages/HelloPage.html.js

import React from 'react';

const HelloComponent = (
    props => {
        // Our route arguments are available at `props.route.args`
        const name = props.route.args.name;
        return (
            <div>
                Hello {name}
            </div>
        );
    }
);

const HelloPage = {
    route: '/hello/{name}', // Page's parameterized URL
    title: 'Hi there', // Page's <title>
    view: HelloComponent, // Page's root React component
};

export default HelloPage;
~~~

Running the `reframe` CLI takes care of the rest:

<p align="center">
    <img src='https://gitlab.com/brillout/reframe/raw/master/docs/screenshots/reframe_overview_screenshot.png' width=1200 style="max-width:100%;"/>
</p>

### Why Reframe?

Reframe has been designed with following focus on
 - Ease of Use
 - Customization
 - Performance

##### Ease of Use

Creating a page is simply a matter of creating a page object and a React component, and
the Quick Start section bellow shows how easy it is.
see how easy it is to create a page that has a server-rendered React component.

Beyond the ease of creating pages, Reframe encourages the creation of apps that use React predominantly on the server which makes developing apps easier. (The "The future of React is SRO" section bellow expands on this.)

#### Customization

Beyond the basic usage that is designed to be as easy as possible, Reframe allows deep customization.

You can have
 - customize server
   - add server routes to create API endpoints, authentication endpoints, etc.
   - custom hapi server config (Reframe uses the hapi server framework by default),
   - use any server framework such as Express, Koa, etc.
 - customize browser JavaScript
   - add error logging, analytics logging, etc.
   - you can have full control of the hydration process
 - transpilation & bundling
   - The webpack config Reframe uses is almost fully customizable (Reframe assumes almost)
   - use typescript

Among others you can use a
custom webpack config (there is almost no restriction about the webpack config Reframe is consuming),
custom browser entry,
custom build tool such as Rollup,
custom server framework such as Express,
custom routing library other than Crossroads.js (Reframe uses Crossroads.js as routing library by default),
custom React integration,
custom view library such as Preact,
etc.


And with some willingness to dive into Reframe, everything is customizable.

Actually, Reframe is fully customizable:
Reframe consists of three packages
(`@reframe/build` that transpiles and bundles, `@reframe/server` that creates the server, `@reframe/browser` that hydrates React components in the browser)
and each of these packages can be replaced with code of your own.
That means that, if you replace all these three packages with your own code, you effectively get rid of Reframe.

That way, you can create by complying to Reframe's design decisions.
and progressively over time and progressively,
as your app's needs mature, crystalize, and doesn't match Reframe's design decisions,
you can replace replace Reframe with code of your own to gain full control.


To further push the evenlop,

Reframe consists of three
has been designed so that every Reframe LOC can be replaced with custom code.

Beyond that, Reframe is fully customizable:


This means that everything 
For more information, see the Customization manual
Reframe consists of 3 parts 


### The future of React is bright and is "SRO-by-default"

> **TL;DR**
> - Pages that have a DOM that is mostly static. are considerably easier to create and considerably more performant.
> - Reframe supports and encourages the creation of such mostly-DOM-static pages.
> - Reframe will eventually
> - A web app framework on eye-level with RoR / Django based on JavaScript and React will soon emerge.

Let's imagine a dev team that needs to implement a web app where no page is interactive.
In other words the DOM is never manipulated.
(We call a web app or a page *DOM-static* when the DOM is not manipulated and we call it *DOM-dynamic* otherwise.)
Would be want to use JavaScript & React to create such DOM-static web app?

Maybe not, as React is a tool for creating interactive views.
Instead we could use Ruby on Rails, Django, or Go.
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
  Every page has loads two scripts:
  A script shared and cached accross all pages that include common code such as React and polyfills,
  and a script that is specific to the page,
  which is typically lightweight.
- Optimal HTTP Caching.
  <br/>
  Every dynamic server response is cached with a Etag header, and
  every static server response is indefinitely cached.
  (By assigning the static asset to a hashed URL, and by setting the `Cache-Control` header to `immutable` and `max-age`'s maxium value.)
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

The main problem with Next.js, is that
 1. using Next.js feels like having tied hands, and
 2. Next.js doesn't embrace the trend of using React predominantly on the server.

About 1:
Next.js works well if you comply with its design decisions, but if you don't, you are in for trouble.
For example, Next's webpack customization is broken (in parts because Next.js doesn't do universal webpack) which leads to no support for typescript, PostCSS, SASS, etc.

About 2:
Next.js doesn't allow you to create pages that load the minimum amount of JavaScript.
But React is more and more used in a server-rendering-only fashion; See the "The future of React is SRO".

Beyond that, Next.js lacks in ease of use. (Next.js's routing is a big hassle, server cusomtization is a hassle, static apps are cumbersome, custom browser JavaScript for things such as error tracking is not supported,  etc.)

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

###### Frameworks

 - [Next.js](https://github.com/zeit/next.js)
 - [After.js](https://github.com/jaredpalmer/after.js)

###### Libraries

 - [Razzle](https://github.com/jaredpalmer/razzle)
 - [Universal Router](https://github.com/kriasoft/universal-router)

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

What happens here

 - Reframe searches for the `/pages` directory and finds it at `~/tmp/reframe-playground/pages`
 - Reframe reads the `/pages` directory 

That's it, we have created our first page. You now know 50% of Reframe's basic usage.

For further information, see The "Basic Usage" section of the [Usage Manual](/docs/usage-manual.md) contains.

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
