Reframe + PostCSS = :heart:

# `@reframe/postcss`

Use Reframe with PostCSS.

### Usage

By adding the `@reframe/postcss` plugin to the `reframe.config`, you will be able to use PostCSS.

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
!INLINE ./example/reframe.config
~~~

~~~js
!INLINE ./example/pages/landing.universal.js
~~~

~~~sugarss
!INLINE ./example/pages/landing.css
~~~
