const assert = require('reassert');
const assert_internal = assert;
const log = require('reassert/log');
const build = require('@reframe/build');
const path = require('path');

const pagesDir = path.resolve(__dirname, '../pages');

const onBuild = (
    async args => {
        assert_internal(args.pages);
        log(args);
        log(Object.keys(args));
        args.pages;
    }
);

build({
    pagesDir,
    onBuild,
});
