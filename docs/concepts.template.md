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

<br/>
<br/>


### Progressive Eject

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


### Universal Framework

> TL;DR
> - Reframe supports all types of apps
> - Start write your prototype and decide later the type of your app
> - No matter what you need, Reframe's got your back

Reframe is universal, that is, you can create any type of web app:

Even more importantly than being able is be able to easly switch from one type of app to another.

It is often not clear at first what type of app is right for you.
Most of is simply a matter of changing plugins or changing page configurations.
Because 

This may seem like just a convenience but this is actually crucial.
If you are using a framework that doesn't support a certain type of app you end, then you have a problem.

For example CRA
([github.com/facebook/create-react-app](https://github.com/facebook/create-react-app))
doesn't support SSR
(Server-side Rendering: render your pages to HTML).
If you start your app with CRA and realize afterwards you need SSR for SEO reasons,
then you'll have to entirely remove CRA altogether.
In contrast, adding SSR with Reframe is simply a matter of setting `renderHtmlAtBuildTime: false`.

> No matter what type of app you end up needing, Reframe's got your back


Let's for example imagine your are building an app with CRA .
With CRA you create a React front-end.
If you then realize that you need a server to render your pages to HTML for SEO reasons then you wil have to entirely remove CRA.
You will actually not be able to use any.
If you for example use  and you realize afterwards
And you realize that you need then you'll need to entirely remove CRA.
In contrast Reframe is simply a matter of 

This means that you can start writing your prototype and decide only at a later point what type of app is right for you.

> Start write your prototype and decide later the type of your app

> Reframe is the only framework that supports every type of web app.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>

### Non-Interactive First Approach

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

