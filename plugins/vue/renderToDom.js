const containerId = 'root-vue';

module.exports = renderToDom;

async function renderToDom({pageConfig, initialProps}) {
    pageConfig.view.$mount('#'+containerId);
}
