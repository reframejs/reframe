1. Install the Reframe CLI.
   ~~~shell
   $ npm install -g @reframe/cli
   ~~~
   <details>
   <summary>With yarn</summary>

   ---

   Alternatively with yarn:

   ~~~shell
   $ yarn global add @reframe/cli
   ~~~

   ---
   </details>
   <details>
   <summary>With npx</summary>
   ---

   With npx you can create a Reframe app without globally installing reframe:

   ~~~shell
   $ npx reframe create !ARGUMENT-1
   ~~~

   Note that you will then to prefix every `$ reframe` command call with `npx`.
   For example for strep 3:
   ~~~shell
   $ cd my-frontend-app/
   $ npx reframe dev
   ~~~
   ---
   </details>

2. Create a new Reframe app.
   ~~~shell
   $ reframe create !ARGUMENT-1
   ~~~
   A `my-!ARGUMENT-1/` directory is created and populated with the !ARGUMENT-1 starter.

3. Build and serve the app.
   ~~~shell
   $ cd my-frontend-app/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. Read [Usage Manual - Basics](/docs/usage-manual.md#basics).
