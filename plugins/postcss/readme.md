<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.






-->

Reframe + PostCSS = :heart:

# `@reframe/postcss`

Use Reframe with PostCSS.

### Usage

Add `@reframe/postcss` to your `reframe.config.js`:

~~~js
module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/postcss') // npm install @reframe/postcss
    ],

    // All options defined here are passed down as options for `postcss-loader`.
    // Thus, this is where you add PostCSS plugins, a PostCSS parser, etc.
    postcss: {
        plugins: [
            require('postcss-cssnext')()
        ],
        parser: 'sugarss',
    }
};
~~~

### Example

~~~js
// /plugins/postcss/example/reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/postcss') // npm install @reframe/postcss
    ],

    // All options defined here are passed down as options for `postcss-loader`.
    // Thus, this is where you add PostCSS plugins, a PostCSS parser, etc.
    postcss: {
        plugins: [
            require('postcss-cssnext')()
        ],
        parser: 'sugarss',
    }
};
~~~

~~~sugarss
// /plugins/postcss/example/pages/landing.css

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

~~~js
// /plugins/postcss/example/pages/landing.config.js

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
    doNotRenderInBrowser: true,
};

export default LandingPage;
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/postcss/readme.template.md` instead.






-->
