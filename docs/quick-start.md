1. Install the Reframe CLI:
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

   Instead of globally installing `@reframe/cli`, you can use
   [npx](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b):
   ~~~shell
   $ npx @reframe/cli create !ARGUMENT-1
   ~~~

   Then prefix every `$ reframe <command>` with `npx`.
   For example:
   ~~~shell
   $ cd my-!ARGUMENT-1/
   $ npx reframe dev
   ~~~
   npx uses the `@reframe/cli` locally installed at `my-!ARGUMENT-1/node_modules/@reframe/cli`.
   <br/><br/>
   </details>

2. Create a new app with the `!ARGUMENT-1` starter:
   ~~~shell
   $ reframe create !ARGUMENT-1
   ~~~

3. Build and serve the app:
   ~~~shell
   $ cd my-!ARGUMENT-1/
   $ reframe dev
   ~~~

4. Open [http://localhost:3000](http://localhost:3000).

5. Read [Usage Manual - Basics](/docs/usage-manual.md#basics).
