!MENU_ORDER 20
!MENU_INDENT 12
!INLINE ./snippets/header.md --hide-source-path
!MENU
&nbsp;

# Starters

&nbsp; | react-frontend | react-app | react-sql
--- | :---: | :---: | :---:
React frontend | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:
Node.js server | :x: | :heavy_check_mark: | :heavy_check_mark:
Database/ORM | :x: | :x: | :heavy_check_mark:

> Note that
> Reframe apps have a flexible stack:
> You can easily add/remove a frontend/backend.
> For example, you can start with a static site and add a Node.js server afterwards.
<br/>

[**react-frontend**](/plugins/create/starters/react-frontend#readme)
<br/>
Scaffolds a static site.
(A static site is an app that consists of only static browser assets such as HTML, CSS, JavaScript, images, fonts, etc.)
Use this starter if you already have a backend
or if you don't need one.
If you are not sure,
then use this starter,
and later add a backend if it turns out that you need one.
<br/>
Examples:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Websites that don't require a server: Homepage, landing page, blog, etc.
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Python backend with a RESTful API + Reframe static site that uses the API.
<br/>

[**react-sql**](/plugins/create/starters/react-sql#readme)
<br/>
Scaffolds a React frontend with a Node.js server,
a SQL database,
an ORM ([Objection.js](https://github.com/Vincit/objection.js)),
and an API ([Wildcard API](https://github.com/brillout/wildcard-api)).
You can use this starter to create a full-stack SSR app or a backend-only app.
<br/>
Examples:
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
To-do list app
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Q&A site like Stack Overflow
<br/> &nbsp;&nbsp;&nbsp;&#8226;&nbsp;
Social site like Reddit
<br/>

[**react-app**](/plugins/create/starters/react-app#readme)
<br/>
Scaffolds a React frontend with a Node.js server.
Same than the `react-app` starter but doesn't scaffold database, ORM and API.
This starter gives you more freedom to choose the tech stack you want.
<br/>
