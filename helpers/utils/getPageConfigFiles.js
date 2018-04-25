const assert_internal = require('reassert/internal');
const assert_usage = require('reassert/usage');
const pathModule = require('path');
const findPackageFiles = require('@brillout/find-package-files');

module.exports = getPageConfigFiles;

function getPageConfigFiles({pagesDir}) {
    if( ! pagesDir ) {
        return [];
    }

    const pageNames = {};

    const pageConfigFiles = (
        findPackageFiles('*.config.*', {cwd: pagesDir, no_dir: true})
        .map(pageConfigFile => {
            const pageName = getPageName(pageConfigFile, pagesDir);
            assert_usage(
                !pageNames[pageName],
                "The page configs `"+pageNames[pageName]+"` and `"+pageConfigFile+"` have the same page name `"+pageName+"`.",
                "Rename one of the two page files."
            );
            assert_internal(pageConfigFile);
            pageNames[pageName] = pageConfigFile;
            return {
                pageConfigFile,
                pageName,
            };
        })
    );

    return pageConfigFiles;
}

function getPageName(pageConfigFile, pagesDir) {
    const endPath = pathModule.relative(pagesDir, pageConfigFile);
    assert_internal(!endPath.startsWith(pathModule.sep), endPath, pageConfigFile);
    assert_internal(!endPath.startsWith('.'), endPath, pageConfigFile);
    const pageName = endPath.split(pathModule.sep).slice(-1)[0].split('.')[0];
    assert_internal(pageName, endPath, pageConfigFile);
    return pageName;
}
