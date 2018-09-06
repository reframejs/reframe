<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.






-->
<a href="https://github.com/reframejs/reframe">
    <img align="left" src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title-and-slogan.min.svg?sanitize=true" width=399 height=79 style="max-width:100%;" alt="Reframe"/>
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
<p align='center'><a href="/../../#readme">Introduction</a> &nbsp; | &nbsp; <a href="/docs/starters.md#readme">Starters</a> &nbsp; | &nbsp; <a href="/docs/usage-manual.md#readme">Usage Manual</a> &nbsp; | &nbsp; <a href="/docs/concepts.md#readme"><b>Concepts</b></a> &nbsp; | &nbsp; <a href="/docs/plugins.md#readme">Plugins</a></p>
&nbsp;

# Concepts

 - [Progressive Eject](#progressive-eject)
 - [Universal Framework](#universal-framework)
 - [Non-Interactive-First Approach](#non-interactive-first-approach)
 - [Simple Architecture](#simple-architecture)

<br/>
<br/>




## Progressive Eject

All of Reframe can be progressively ejected.

For example, the CLI command `$ reframe eject server` ejects the server code:
[~20 lines of code](/plugins/hapi/start.js)
are copied from Reframe's codebase and added to your codebase.
Allowing you to modify the server code.
You can then
add API endpoints,
change the server config,
change the whole server implementation,
etc.

There are several eject commands that
you can apply one by one and progressively as the need arises.

If you run all eject commands then you effectively get rid of Reframe.

> Reframe doesn't lock you in: You can progressively and fully eject Reframe.

Once you fully eject Reframe, your app will not depend on Reframe anymore.
Instead it will depend on state-of-the-art and do-one-thing-do-it-well libraries only.
At that point you have the same flexibility
as if you would have implemented your app on top of these do-one-thing-do-it-well libraries.

> Quickly implement a prototype while staying fully flexible down the road.

<b><sub><a href="#concepts">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>




## Universal Framework

> TL;DR
> - Universal framework: A framework that supports all types of apps.
> - Reframe is the only universal framework.
> - Start write your prototype and decide later the type of your app.
> - Whatever type of app you end up needing, Reframe's got your back.

Reframe is a what we call a *universal framework*, that is, a framework that supports all types of apps.
You can create a frontend without backend, a backend without frontend, or a frontend + backend.
And you can use any view library such as React or Vue.js.

And, maybe even more importantly, changing from one app type to another is easy.
With Reframe, changing the type of your application is simply a matter of changing plugins or changing your page configs.

It is often, at first, not clear what type of app is the right the one.
So instead of having to decide the type of your app before starting to code,
you start with your best guess and as your app matures you change the type of your application.
For example, you can start writing a React frontend without a backend and
if you realize at a later point that you do need a backend after all,
you can easily add one afterwards.

> Start write your prototype and decide later the type of your app.

That Reframe allows you to easily switch between any type of app is crucial.
For example, CRA
([github.com/facebook/create-react-app](https://github.com/facebook/create-react-app))
doesn't support SSR
(Server-side Rendering, that is the rendering of your pages to HTML)
and, if you write your app with CRA and realize afterwards that you need SSR (for SEO reasons e.g.),
then you'll have to get rid of CRA.
In contrast, adding SSR with Reframe is simply a matter of setting `renderHtmlAtBuildTime: false`.

> Whatever type of app you end up needing, Reframe's got your back.

Most of Reframe's flexibility is a consequence of Reframe's simple architecture.
There are no other framework out there that give you such flexibility.

> Reframe is the only universal framework.

<b><sub><a href="#concepts">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>






## Non-Interactive-First Approach

> TL;DR
> - Prefer to implement non-interactive views over interactive views to considerably increase dev speed.
> - Reframe is the only framework that embraces the non-interative-first approach.

Interactive views (an interactive graph, a like button, a To-Do list, etc.) are a powerful addition to our dev toolbox.
They allow us to implement incredible things and Reframe has first-class support for interactive views.

But they come with a downside: They are often complex and take considerably more time to implement.

In general:
- **Interactive** views are **difficult** to implement **but powerful**.
- **Non-interactive** views are considerably **easier** to implement.

People new to web dev are often not aware of that and make the mistake to implement interactive views
where good old-school non-interactive HTML pages would have done the job just fine.
Even senior devS often overly use interactive views.

Using interactive views all over the place is fine if you are Netflix and have lot's of devS.
But if you have limited resources then you may want to reconsider and choose non-interactive views over interactive views.

Leading us to what we call the *non-interactive-first approach*:
 - Whenever possible implement features with non-interactive views.
 - First, implement a prototype with a minimal amount of interactive views, then gradually add interactive views to improve your app's UX.

> Increase dev speed by preferring implementing features with non-interactive views

Reframe allows you to create non-interactive pages:
Set `doNotRenderInBrowser: true` to a page's config and the page will not be rendered in the browser.
(More at [Usage Manual - `doNotRenderInBrowser`](/docs/usage-manual.md#donotrenderinbrowser).)

This means that you can create an app that has interactive pages as well as non-interactive pages.
For example an `/about` page that is static and non-interactive
(browser doesn't load any JavaScript and the DOM is static)
and a `/search` page that is dynamic and interactive
(browser loads React components and the DOM is dynamic).

We call such apps *mixed web apps*.

> Mixed web apps are the future and Reframe is the only framework supporting them.

<b><sub><a href="#concepts">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>






## Simple Architecture

> TL;DR
> - Reframe's code is simple.
> - As you eject Reframe you inherit a simple architecture.
> - Reframe's simple architecture is the reason why Reframe is highly flexible.

Reframe's essence is to care a great amount about
 - Rapid dev - Allow Reframe's user to go from 0 to a working prototype in the shortest amount of time possible.
 - Full flexibility - Give Reframe's user as much freedom as possible.
 - Simple architecture - Make Reframe's codebase as simple as possible.

Reframe's architecture is simple: It's all about one global config.

 - Plugins add things (parameters or functionality) to the global config.
 - Plugins use things defined in the global config.

In essence, the config acts as dependency injection.
(When you think about it, a config is an inversion of control.)

Everything is a plugin.
Other than the CLI, every single Reframe line of code is contained in a plugin.

This means that you can change every part of Reframe
by simply switching out plugins /
by changing the global config
(by modifying your `reframe.config.js`).

For example, using another build tool other than webpack is simply a matter of removing the webpack plugin and adding two functions `build()` and `getBuildInfo()` to the global config.

<b><sub><a href="#concepts">&#8679; TOP &#8679;</a></sub></b>

<br/>
<br/>





<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/concepts.template.md` instead.






-->
