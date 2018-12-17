<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.






-->
<a href="/../../#readme">
    <img align="left" src="https://github.com/reframejs/reframe/raw/master/docs/images/logo-with-title-and-slogan.min.svg?sanitize=true" width=296 height=79 style="max-width:100%;" alt="Reframe"/>
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
              src="https://github.com/reframejs/reframe/raw/master/docs/images/tw.svg?sanitize=true"
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
<p align='center'><a href="/../../#readme">Intro</a> &nbsp; | &nbsp; <a href="/docs/starters.md#readme"><b>Starters</b></a> &nbsp; | &nbsp; <a href="/docs/usage-manual.md#readme">Usage Manual</a> &nbsp; | &nbsp; <a href="/docs/concepts.md#readme">Concepts</a> &nbsp; | &nbsp; <a href="/docs/plugins.md#readme">Plugins</a></p>
&nbsp;

# Starters

**Don't bother choosing the right starter**:
As described in [Usage Manual - Flexible Stack](/docs/plugins.md#use-cases),
a Node.js server and a database/ORM can easily be removed/added afterwards.

<p align="center">

&nbsp; | react-frontend | react-app | react-sql
--- | :---: | :---: | :---:
React Frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js Server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

</p>

- [react-frontend](/plugins/create/starters/react-frontend#readme)
  Scaffolds a static site.
  (A static site is an app that consists of only static browser assets such as JavaScript, CSS, images, fonts, etc.)
  test:
   - bla
   - blue
  You can use this starter if you already have a backend
  or if your app doesn't need one.
  <br/>
  *Examples:*
  <br/>
  Simple websites such as a homepage, a landing page, or a blog typically don't require a server
  and can be implemented using this starter.
  <br>
  Or if you have a python backend with a RESTful API
  then you can use this starter to scaffold a React frontend
  that interacts with the backend over the API.
- [react-sql](/plugins/create/starters/react-sql#readme)
  Scaffolds a React frontend with a Node.js server,
  a SQL database,
  an ORM ([Objection.js](https://github.com/Vincit/objection.js)),
  and an API ([Wildcard API](https://github.com/brillout/wildcard-api)).
  You can use this starter to create a SSR app and a backend-only app.
  <br/>
  *Examples:*
  <br/>
  A to-do list app,
  a Q&A site like Stack Overflow,
  a social site like Reddit, etc.
- [react-app](/plugins/create/starters/react-app#readme)
  Scaffolds a React frontend with a Node.js server.
  So the same than the `react-app` starter but without database, ORM and API.
  This starter gives you more freedom to choose the tech stack you want.

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/docs/starters.template.md` instead.






-->
