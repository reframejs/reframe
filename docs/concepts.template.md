!MENU_ORDER 40
!MENU_INDENT 12
!INLINE ./snippets/header.md --hide-source-path
!MENU
&nbsp;

# Concepts

Reframe conceputal fundations.

 - [Truly Flexible](#truly-flexible)
 - [Non-interactive-first Approach](#non-interactive-first-approach)
 - [Universal Framework](#universal-framework)
 - [Flexible Stack](#flexible-stack)
 - [Progressive Eject](#progressive-eject)

<br/>
<br/>


## Truly Flexible

> TL;DR
> - It is a common misconception to think that gluying do-one-thing-do-it-well libaries yourself provides the highest flexibility
> - The problem with stiching things yourself is that you end up with a rigid architecture
> - Reframe is actullay more flexible than gluying do-one-thing-do-it-well libraries yourself
> - We think that Reframe is the best tool out there for rapid prototyping

We developers cherish freedom.
Especially after the bad experiences we had with big and monstrous monoliths such as GWT or Meteor.
They tightly tied our hands and restricted our expressive freedom.
That's not cool.
We are inclined into thinking
"I will not use a big framework again.
Instead I build things on top of rock-solid do-one-thing-do-it-well libraries and stay 100% free."
This seems a sensible choice.
Especially with tools such as React or PostgreSQL that are here to stay.

But orchestrating these rock-solid do-one-thing-do-it-well libraries into a solid and flexible architecture
is a challanging and time consuming task.
And even more so when using a view library such as React or Vue.
The time consuming part is not the biggest the problem
(and it actually can be fun and insightful).
The biggest problem is that you most likely end up writing an architecture that is rigid.

For example
[SSR](https://github.com/brillout/awesome-universal-rendering#techniques).
If you assume that you don't need SSR then you'll stitch do-one-thing-do-it-well libraries based on that assumption.
But if it turns out that you actually do need SSR then you'll have to rewrite large parts of your architecture.
In contrast, Reframe's architecture is designed from the ground up to be flexible and adding/removing SSR is easy.

While prototyping,
you need high development speed combined with high flexibility to be able to adapt to the insights you gain
while testing your prototypes.
For example,
instead of researching for hours whether or not you need SSR,
with Reframe you can first write a prototype and worry about that question afterwards.
Later,
once you have a functioning prototype,
you can make real world tests to see if you need SSR.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>



## Non-interactive-first Approach

> TL;DR
> - Interactive views are powerful but complex.
> - Non-iteractive-first approach: Prefer non-interactive views over interactive views.
> - Reframe is the only framework that embraces the non-interative-first approach.
> - Mixed web app: A web app that has non-interactive pages as well as interactive pages.
> - Mixed web apps are the future and Reframe is the only framework supporting them.

Interactive views
(an interactive graph, a like button, a To-Do list, etc.)
are a powerful addition to our dev toolbox.
They allow us to implement incredible things and Reframe has first-class support for interactive views.

But they come with a downside:
They are complex and take considerably more time to implement.

In general:
- **Interactive** views are **difficult** to implement **but powerful**.
- **Non-interactive** views are considerably **easier** to implement.

People new to web dev are often not aware of that and make the mistake to implement interactive views
where good old-school non-interactive HTML pages would do the job just fine.

Using interactive views all over the place is fine if you are Netflix with a huge dev budget.
But if you have limited resources then you may want to consider prefering non-interactive views over interactive views.

Leading us to what we call the *non-interactive-first approach*:
 - Whenever possible implement features with non-interactive views.
 - First, implement a prototype with a minimal amount of interactive views, then gradually add interactive views to improve your app's UX.

> Increase dev speed by preferring implementing features with non-interactive views

Reframe allows you to create non-interactive pages:
Set `doNotRenderInBrowser: true` to a page's config and the page will not be rendered in the browser.
(More at [Usage Manual - `doNotRenderInBrowser`](/docs/usage-manual.md#donotrenderinbrowser).)

This means that you can create an app that has interactive pages as well as non-interactive pages.
For example an `/about` page that is non-interactive
(browser doesn't load any JavaScript and the DOM is static)
and a `/search` page that is interactive
(browser loads React components and the DOM is dynamic).

We call such apps *mixed web apps*.

> Mixed web apps are the future and Reframe is the only framework supporting them.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>




## Universal Framework

Reframe is a what we call a *universal framework*, that is, a framework that supports all JavaScript stacks:

 - Supports all frontend/backend combination:
   You can create a frontend without backend, a backend without frontend, or a frontend + backend.
 - Supports any do-one-thing-do-it-well libraries:
   Reframe integrates can integrate with any view library such as React or Vue,
   with any bundler such as Webpack or Parcel,
   with any server framework such as Express, Koa, or Hapi,
   etc.

To our knowledge, Reframe is the only universal framework.

And, maybe even more importantly, the stack can be changed at any time and easily.
We call this a *flexible stack*.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>



## Flexible Stack

> - You can change your app's stack easily and at any time
> - Start write your prototype and decide later the type of your app.
> - Whatever type of app you end up needing, Reframe's got your back.

With Reframe, changing your app's stack is simply a matter of changing plugins or changing your page configs.

It is often, at first, not clear what stack is the right one.
So instead of having to decide the stack before starting your project,
you start with your best guess.
And, as your app matures and as it becomes more clear what type of app is right for you,
you can change the type of your app.
For example,
you can start writing a React static site (that is a frontend without a backend) and
if you later realize that you actually need a backend,
then you can easily add one.

> Start write your prototype and decide later the type of your app.

That Reframe allows you to easily switch between any type of app is crucial.
For example, CRA
([github.com/facebook/create-react-app](https://github.com/facebook/create-react-app))
doesn't support SSR.
This means that
if you write your app with CRA and realize afterwards that you need SSR,
then you'll have to get rid of CRA and refactor your app.
In contrast, adding SSR to Reframe static site is easy.

> Whatever stack you end up needing, Reframe's got your back.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>




## Progressive Eject

All Reframe parts can be progressively ejected.

For example, the CLI command `$ reframe eject server` ejects the server code:
[~30 lines of code](/plugins/hapi/start.js)
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
You then have full freedom.

> Quickly implement a prototype while staying fully flexible down the road.

!INLINE ./top-link.md #concepts --hide-source-path

<br/>
<br/>


