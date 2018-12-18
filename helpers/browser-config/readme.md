<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.






-->

# `@brillout/browser-config`

A 1-LOC package to have a global configuration object in the browser. (Works in Node.js too.)

### Usage

~~~js
// /helpers/browser-config/example/config.js

const browswerConfig = require('@brillout/browser-config'); // npm install @brillout/browser-config

browswerConfig.myNewConfig = 42;
~~~

~~~js
// /helpers/browser-config/example/run.js

require('./config');

const browswerConfig = require('@brillout/browser-config');

// This will print 42
console.log(browswerConfig.myNewConfig);
~~~

### How it works

It's trivial: The package simply exports a plain JavaScript object that acts as the global configuration object.

The source code is:

~~~js
// /helpers/browser-config/index.js

module.exports = {};
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/helpers/browser-config/readme.template.md` instead.






-->
