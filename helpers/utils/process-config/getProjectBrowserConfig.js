const processBrowserConfig = require('./processBrowserConfig');

module.exports = getProjectBrowserConfig;

let cache;

function getProjectBrowserConfig() {
    if( ! cache ) {
        cache = computeConfig();
    }
    return cache;
}

function computeConfig() {
    const plugins = [];
    let currentPageConfig;

    const projectBrowserConfig = {};

    setConfig();

    return projectBrowserConfig;

    function setConfig() {
        for(const prop in projectBrowserConfig) delete projectBrowserConfig[prop];

        const browserConfigObject = {plugins};
        const processed = processBrowserConfig(browserConfigObject);
        const descriptors = Object.getOwnPropertyDescriptors(processed);
        for(const prop in descriptors) {
            Object.defineProperty(projectBrowserConfig, prop, descriptors[prop]);
        }

        Object.assign(projectBrowserConfig, {addPlugins, setCurrentPageConfig, currentPageConfig});
    }

    function setCurrentPageConfig(currentPageConfig_) {
        currentPageConfig = currentPageConfig_;
        setConfig();
    }
    function addPlugins(plugins_) {
        plugins.push(...plugins_);
        setConfig();
    }
}
