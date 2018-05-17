### Future of Reframe

<br/>

 - Third party library installation
   - Write a Google Anaylitics plugin `@reframe/google-analytics`
   - Sentry plugin `@reframe/sentry`
   - etc.
   - Easy to implement


<br/>


 - Redux plugin
   - Should be easy



<br/>


 - Deploy
   - Implement `@reframe/deploy-serverless` plugin
     - Serverless deploy with up (https://github.com/apex/up)
     - `reframe/deploy-severless` would be just a little wrapper around up
   - Implement `@reframe/deploy-static` plugin
     - Which static website host should be used? GitHub Pages, Netlify?
   - Should be relatively easy to implement


<br/>


 - Write docs for beginners

<br/>

 - Reframe Blog
   - Plugin `@reframe/blog` to easily create a blog
   - Themes are implement with React and hence fully customizable
   - Able to write new pages by providing a markdown string instead of a React component
     - Theme wraps the provided markdown. (In other words we use React+markdown to render a new blog post.)

<br/>

 - ORM
   - Integrate with existing ORM?
     - https://github.com/typeorm/typeorm
     - https://vincit.github.io/objection.js/
     - ORM of https://github.com/balderdashy/sails/
     - etc.
   - Integrate with managed/serverless databases?
     - https://github.com/apex/up/wiki#databases
   - Implement something like GraphQL but much easier usage and much simpler implementation? (GraphQL is overkill for a non-public API.)
     - So that the users uses the same API no matter what ORM/database is used.
   - Complex but very intersting
   - Full-stack API
     - The user shouldn't have to create any enpdoints, she simply writes
        ~~~js
        // models.js

        import orm from '@reframe/orm';

        orm.addModel({
            modelName: 'todo',
            text: String,
        });
        ~~~
        ~~~jsx
        // pages/WelcomePage.config.js

        import React from 'react';
        import orm from '@reframe/orm';

        export default {
            route: '/',
            getInitialProps: async () => {
                const todos = await orm.todo.getAll();
                return {todos};
            },
            view: props => (
                <ul>{
                    props
                    .todos
                    .map(todo =>
                        <li>todo.text</li>
                    )
                }</ul>
            ),
        };
        ~~~
