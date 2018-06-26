!INLINE ./header-light.md --hide-source-path
!INLINE ./links.md --hide-source-path
<br/>

!MENU
!MENU_ORDER 40

<br/>

# Overview

 - [Progressive Eject](#progressive-eject)
 - [Universal Framework](#universal-framework)

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

<br/>
<br/>

