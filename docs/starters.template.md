!MENU_ORDER 20
!MENU_INDENT 12
!INLINE ./snippets/header.md --hide-source-path
!MENU
&nbsp;

# Starters

**Don't bother choosing the right starter**:
As described in [Usage Manual - Flexible Stack](/docs/plugins.md#use-cases),
a Node.js server and a database/ORM can easily be removed/added afterwards.

&nbsp; | react-frontend | react-app | react-sql
--- | :---: | :---: | :---:
React Frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js Server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

- [react-frontend](/plugins/create/starters/react-frontend#readme)
  <br/>
  Scaffolds a static site.
  (A static site is an app that consists of only static browser assets such as JavaScript, CSS, images, fonts, etc.)
  You can use this starter if you already have a backend
  or if your app doesn't need one.
  <br/>
  Examples:
   - Simple websites such as a homepage, a landing page, or a blog typically don't require a server
     and can be implemented using this starter.
   - Or if you have a python backend with a RESTful API
     then you can use this starter to scaffold a React frontend
     that interacts with the backend over the API.

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
