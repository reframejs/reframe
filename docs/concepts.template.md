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
 - [Non-interactive-by-default Approach](#non-interactive-by-default-approach)

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

### Non-interactive-by-default approach

Interactive views (An interactive graph, a like button, a To-Do list, etc.) are a powerful addition to our dev toolbox.
They allow to implement incredible web apps and Reframe has first-class support for interactive views.

But they come with a downside: They are often complex and time consuming to implement.

People new to web dev are often not aware of that and make the mistake to implement 
We are all too often tempted to use interactive views to implement features where a good old-school non-interactive HTML page would have done the job just fine.

In general 
Hence 

Interactive views

- Manage state view
- Visual transition between state
- Performance management
  - Runtime speed management (rendering to HTML is considerably more performant than rendering to the DOM.)
  - Code size management
  - Mobile

That's fine if you are Netflix and have .

But if you have limited resource you may want to choose to implement non-interactive views over implementing interactive views.
We call this the "non-interactive-by-default approach": Whenever possible implement features with non-interactive views.

Reframe embraces the non-interactive-by-default approach by allowing you to create non-interactive pages:
Set `doNotRenderInBrowser: true` to a page's config and the page will not be rendered in the browser.
Instead your page is only rendered to HTML in Node.js.
(Views written with React and Vue can be rendered to HTML.)

This means you can create apps that mix interactive
Reframe introduces a new type of app we call "mixed apps".
A *mixed app* is an app that has interactive pages as well as non-interactive pages.
For example a `/about` page that is static and non-interactive
(browser doesn't load any JavaScript and the DOM is static)
and a `/search` page that is dynamic and interactive
(browser loads React components and the DOM is dynamic).
<br/>
Both are important:
Interactive views are difficult to implement but powerful while
non-interactive views are considerably easier to implement.
<br/>
Mixed apps allow you to follow the non-interactive-by-default approach:
Whenever possible, implement features with non-interative views.
<br/>
Mixed apps are the future and Reframe is the only framework supporting them.

Re
