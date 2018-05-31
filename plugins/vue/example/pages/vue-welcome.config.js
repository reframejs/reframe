import Vue from 'vue';

const app = new Vue({
    render: createElement => createElement('div', 'Hello from Vue'),
});

export default {
    route: '/',
    view: app,
};
