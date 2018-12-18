<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.






-->

Reframe + Vue = :heart:

# `@reframe/vue`

Use Reframe with Vue.

### Usage

Add `@reframe/vue` to your `reframe.config.js`:

~~~js
module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/vue') // npm install @reframe/vue
    ],
};
~~~

### Example

~~~js
// /plugins/vue/example/reframe.config.js

module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/vue') // npm install @reframe/vue
    ],
};
~~~

~~~js
// /plugins/vue/example/pages/vue-welcome.config.js

import Vue from 'vue';

const app = new Vue({
    render: createElement => createElement('div', 'Hello from Vue'),
});

export default {
    route: '/',
    view: app,
};
~~~

<!---






    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.












    WARNING, READ THIS.
    This is a computed file. Do not edit.
    Edit `/plugins/vue/readme.template.md` instead.






-->
