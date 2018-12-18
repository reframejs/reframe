<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.






-->

Reframe + Crossroads = :heart:

# `@reframe/crossroads`

Routing with [Crossroads.js](https://github.com/millermedeiros/crossroads.js).

### Usage

Add `@reframe/crossroads` to your `reframe.config.js`:

~~~js
module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/crossroads')
    ]
};
~~~

### Example

~~~js
// /plugins/crossroads/example/reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/crossroads')
    ]
};
~~~

~~~sugarss
// /plugins/crossroads/example/pages/hello.config.js

import React from 'react';

const HelloPage = {
    route: '/hello/{name}',
    view: props => {
      const name = props.route.args.name;
      return <div>Hello {name}</div>;
    },
};

export default HelloPage;
~~~

~~~js
// /plugins/crossroads/example/pages/landing.config.js

import React from 'react';

export default {
    route: '/',
    view: () => (
        <div>
            <a href="/hello/lisa">/hello/lisa</a>
            <br/>
            <a href="/hello/jon">/hello/jon</a>
        </div>
    ),
};
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/crossroads/readme.template.md` instead.






-->
