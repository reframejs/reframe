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

Reframe is universal, that is, you can create any type of web app:

 - **Modern interactive apps** <sup><sub>:sparkles:</sub></sup>
   <br/>
   Apps with interactive views.
   (An interactive graph, a like button, a To-Do list, etc.) (The browser loads the page's view and renders it to the DOM &mdash; the DOM is dynamic.)
 - **Good ol' 1998 websites** <sup><sub>:floppy_disk:</sub></sup>
   <br/>
   Apps without interactive views.
   (The browser doesn't load any JavaScript. The DOM is static.)
 - **Mixed apps** :tm:
   <br/>
   Apps that mix both: Modern interactive pages <sup><sub>:sparkles:</sub></sup> as well as good ol' 1998 non-interative pages <sup><sub>:floppy_disk:</sub></sup>.

The cherry on the cake is that choosing the type of your app is simply a matter of setting the page config options `htmlStatic` and `domStatic`.
This means that you can start writing your prototype and decide only at a later point what type of app is right for you.

> Reframe is the only framework that supports every type of web app.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>

### Non-Interactive First Approach

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
 - Implement a prototype with non-interactive views first to then gradually add interactive views later.

Reframe embraces the non-interactive-first approach by allowing you to create non-interactive pages:
Set `doNotRenderInBrowser: true` to a page's config and the page will not be rendered in the browser.
More at [Usage Manual - `doNotRenderInBrowser`](/docs/usage-manual.md#donotrenderinbrowser).

This means that you can create an app that has interactive pages as well as non-interactive pages.
For example a `/about` page that is static and non-interactive
(browser doesn't load any JavaScript and the DOM is static)
and a `/search` page that is dynamic and interactive
(browser loads React components and the DOM is dynamic).

We call such apps *mixed apps*.
Mixed apps are the future and Reframe is the only framework supporting them.


!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>

