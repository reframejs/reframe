!MENU_ORDER 20
!MENU_INDENT 12
!INLINE ./snippets/header.md --hide-source-path
!MENU
&nbsp;

# Starters

&nbsp; | react-frontend | react-app | react-sql
--- | :---: | :---: | :---:
React Frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js Server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

*Note*:
Reframe apps have a flexible stack:
You can easily add/remove a frontend or backend.
For example you can start with a static site and add a Node.js server afterwards.

- [react-frontend](/plugins/create/starters/react-frontend#readme)
  <br/>
  Scaffolds a static site.
  You can use this starter if you already have a backend
  or if your app doesn't need one.
  (A static site is an app that consists of only static browser assets such as JavaScript, CSS, images, fonts, etc.)
  <br/>
  Examples:
  <br/> &nbsp;&nbsp;&nbsp;&#x25e6;&nbsp;
  Simple websites such as a homepage, a landing page, or a blog typically don't require a server.
  <br/> &nbsp;&nbsp;&nbsp;&#x25e6;&nbsp;
  Python backend with a RESTful API + React frontend using the API

- [react-sql](/plugins/create/starters/react-sql#readme)
  <br/>
  Scaffolds a React frontend with a Node.js server,
  a SQL database,
  an ORM ([Objection.js](https://github.com/Vincit/objection.js)),
  and an API ([Wildcard API](https://github.com/brillout/wildcard-api)).
  You can use this starter to create a SSR app and a backend-only app.
  <br/>
  Examples:
   - To-do list app
   - Q&A site like Stack Overflow
   - Social site like Reddit

- [react-app](/plugins/create/starters/react-app#readme)
  <br/>
  Scaffolds a React frontend with a Node.js server.
  So the same than the `react-app` starter but without database, ORM and API.
  This starter gives you more freedom to choose the tech stack you want.
