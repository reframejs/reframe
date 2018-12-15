1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~
   <details>
   <summary>With yarn</summary>

   ~~~shell
   $ yarn global add @reframe/cli
   ~~~
   </details>
   <details>
   <summary>With npx (local install)</summary>

   With
   <a href="https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b">npx</a>,
   instead of having a global install,
   you prefix `$ reframe <command>` with `npx`.
   That is:
   ~~~shell
   $ npx reframe create !ARGUMENT-1
   ~~~
   and
   ~~~shell
   $ cd my-!ARGUMENT-1/
   $ npx reframe dev
   ~~~
   </details>

2. Create a new app with the `!ARGUMENT-1` starter.
   ~~~shell
   $ reframe create !ARGUMENT-1
   ~~~

3. Build and serve the app.
   ~~~shell
   $ cd my-!ARGUMENT-1/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. Read [Usage Manual - Basics](/docs/usage-manual.md#basics).
