const {IsoBuilder} = require('@rebuild/iso');
const getReframeConfig = require('@reframe/utils/getReframeConfig');
const webpack = require('webpack');
const getBrowserConfig = require('./getBrowserConfig');
const getNodeConfig = require('./getNodeConfig');

module.exports = build();

async function build() {
    const isoBuilder = new IsoBuilder();

    const fileWriter = new FileWriter();

    let pageConfigs;

    const reframeConfig = getReframeConfig();
    const {fileStructure: {pagesDir, staticAssetsDir}} = reframeConfig;

    isoBuilder.builder = async there_is_a_newer_run => {
        const pageConfigs = readPagesDir(pagesDir);

        const nodeEntries = getNodeEntries(pageConfigs);
        const nodeConfig = getNodeConfig(nodeEntries);
        const nodeCompiler = webpack(nodeConfig);
        await isoBuilder.build_node(node_entries);

        writeBrowserEntryFiles(pageConfigs, fileWriter);

        const browserEntries = getBrowserEntries();
        const browserConfig = getBrowserConfig(browserEntries);
        const browserCompiler = webpack(browserConfig);
        await isoBuilder.build_browser(browserCompiler);

        writeHtmlFiles(pageConfigs, fileWriter);

        return isoBuilder;
    };

    isoBuilder.watchDir(pagesDir);

    await isoBuilder.build();

    const getPageConfigs = () => pageConfigs;
    return getPageConfigs;
}
