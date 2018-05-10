Reframe + PostCSS = :heart:

# `@reframe/postcss`

Use Reframe with PostCSS.

### Usage

Add `@reframe/postcss` to your `reframe.config.js` to use Reframe with PostCSS:

~~~js
// reframe.config.js

const postcss = require('@reframe/postcss'); // npm install @reframe/postcss

module.exports = {
    plugins: [
        postcss({
            loaderOptions: {
                // All options defined here are passed down as options for `postcss-loader`.
                // This is where you add PostCSS plugins, a PostCSS parser, etc.
            },
        })
    ],
};
~~~

### Example

~~~js
!INLINE ./example/reframe.config.js
~~~

~~~sugarss
!INLINE ./example/pages/landing.css
~~~

~~~js
!INLINE ./example/pages/landing.config.js
~~~
