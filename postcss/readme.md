<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.






-->
Reframe + PostCSS = :heart:

# `@reframe/postcss`

Use Reframe with PostCSS.

### Usage

By adding the `@reframe/postcss` plugin to your `reframe.config`, you will be able to use PostCSS.

~~~js
// reframe.config

const postcss = require('@reframe/postcss'); // npm install @reframe/postcss

module.exports = {
    plugins: [
        postcss({
            loaderOptions: {
                // Loader options
                // This is where you add PostCSS plugins, PostCSS parser, etc
                // All options defined here are passed down to the `postcss-loader` options.
            },
        })
    ],
};
~~~

### Example

~~~js
// /postcss/example/reframe.config

const postcss = require('@reframe/postcss');

module.exports = {
    plugins: [
        postcss({
            loaderOptions: {
                plugins: [
                    require('postcss-cssnext')(),
                ],
                parser: 'sugarss',
            },
        })
    ],
};
~~~

~~~js
// /postcss/example/pages/landing.universal.js

import React from 'react';
import './landing.css';

const LandingComponent = () => (
    <div>
        <div className="blue-on-red">
            Blue on red.
        </div>
        <div className="red-on-blue">
            Red on blue.
        </div>
    </div>
);

const LandingPage = {
    route: '/',
    view: LandingComponent,
};

export default LandingPage;
~~~

~~~sugarss
// /postcss/example/pages/landing.css

:root
  --red: #f88
  --blue: #88f

.red-on-blue
  background-color: var(--blue)
  color: var(--red)

.blue-on-red
  background-color: var(--red)
  color: var(--blue)

.red-on-blue,
.blue-on-red
  font-size: 2em
  width: 300px
  padding: 20px
  margin: 10px
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/postcss/readme.template.md` instead.






-->
