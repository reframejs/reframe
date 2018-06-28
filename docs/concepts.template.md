!INLINE ./header-light.md --hide-source-path
<br/>
!INLINE ./links.md --hide-source-path

!MENU
!MENU_ORDER 40
!MENU_INDENT 12

<br/>

# Concepts

 - [Progressive Eject](#progressive-eject)
 - [Universal Framework](#universal-framework)
 - [Non-Interactive First Approach](#non-interactive-first-approach)
 - [Simple Architecture](#simple-architecture)

<br/>
<br/>


## Progressive Eject

All of Reframe can be progressively ejected.

For example, the CLI command `$ reframe eject server` ejects the server code:
[Around 30 lines of code](/plugins/hapi/start.js)
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

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>


## Universal Framework

> TL;DR
> - Universal framework: A framework that supports all type of apps
> - Reframe is the only universal framework
> - Start write your prototype and decide later the type of your app
> - Whatever you need, Reframe's got your back

Reframe is a what we call a *universal framework*, that is, you can create any type of web app.
You can create a frontend without backend, a backend without frontend, or a frontend + backend.
And you can use any view library such as React, Vue.js, etc.

And, maybe even more importantly, changing from one app type to another is easy.
With Reframe, changing the type of your application is simply  amtter of changing plugins or changing page configurations.

It is often not clear at first what type of app is right for you.
So instead of having to decide the type of your application before starting to write your prototype, you simply start with your best guess and as your prototype matures you change the type of your application. For example, you can start writing a React frontend without a backend and if you afterwards realize that you do need a backend then you can easily add one.

> Start write your prototype and decide later the type of your app

That Reframe allows you to easily switch between any type of app
may be more crucial than you realize.
For example, CRA
([github.com/facebook/create-react-app](https://github.com/facebook/create-react-app))
doesn't support SSR
(Server-side Rendering, that is the rendering of your pages to HTML).
And if you start writing your app with CRA and realize afterwards that you need SSR for SEO reasons,
then you'll have to entirely remove CRA.
In contrast, adding SSR with Reframe is simply a matter of setting `renderHtmlAtBuildTime: false`.

> No matter what type of app you end up needing, Reframe's got your back

We are not aware.
Reframe's high flexibility comes from a simple design.
Even though .
We care a lot about. We want
As you eject Reframe 
inheriting a simple design 
There are no other framework that give you that amount of flexibility.

> Reframe is the only universal framework.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>

## Non-Interactive First Approach

> TL;DR
> - Choose to implement non-interactive views over interactive views to significantly increase dev speed
> - Reframe is the only framework that embraces the non-interative first approach

Interactive views (an interactive graph, a like button, a To-Do list, etc.) are a powerful addition to our dev toolbox.
They allow us to implement incredible web apps and Reframe has first-class support for interactive views.

But they come with a downside: They are often very complex and take considerably more time to implement.

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
 - Implement a prototype with a minimal amount of interactive views first. Then gradually add interactive views to improve the UX quality of your app.

> Increase your dev speed by preferring non-interactive views over interactive views

Reframe embraces the non-interactive-first approach by allowing you to create non-interactive pages:
Set `doNotRenderInBrowser: true` to a page's config and the page will not be rendered in the browser.
More at [Usage Manual - `doNotRenderInBrowser`](/docs/usage-manual.md#donotrenderinbrowser).

This means that you can create an app that has interactive pages as well as non-interactive pages.
For example a `/about` page that is static and non-interactive
(browser doesn't load any JavaScript and the DOM is static)
and a `/search` page that is dynamic and interactive
(browser loads React components and the DOM is dynamic).

We call such apps *mixed apps*.

> Mixed apps are the future and Reframe is the only framework supporting them.


!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>

## Simple Architecture

> TL;DR
> - Reframe's code is simple
> - Reframe's simple architecture is the reason why Reframe is highly flexible
> - As you eject Reframe you will inherit a simple architecture

Reframe's essence is to care a great amount about
 - Rapid dev - Allow Reframe's users to go from 0 to a working prototype in the shortest amount of time possible.
 - Full flexibility - Give Reframe's user full as much freedom as possible.
 - Simple architecture - Make Reframe's codebase as simple as possible.

Reframe's architecture is simple: It's all about one global config.

 - Plugins add stuff (parameters, functions, etc.) to the global config
 - Plugins use stuff defined in the global config

In essence, the config acts as dependency injection.
(When you think about it, every config system is an inversion of control.)

Everything is a plugin.
Other than the CLI, every single Reframe code is contained in a plugin.

This means that you can change every part of Reframe simply by switching out plugins or by changing the global config.
(That is by modifying your `reframe.config.js`.)

For example, using another build tool, other than webpack, is simply a matter of changing the global config.


!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>

