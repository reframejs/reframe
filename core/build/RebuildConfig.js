const assert = require('reassert');
const assert_usage = assert;

module.exports = RebuildConfig;

function RebuildConfig({pagesPath}={}) {
    assert_usage(pagesPath);
    return () => {
        return {
            entry: {
                pages: [
                    pagesPath,
                ],
            },
            output: {
                libraryTarget: 'umd',
            }
        };
    };
}
