const getPackages = require('../getPackages');
const assert = require('reassert');

module.exports = getNpmTags;

async function getNpmTags() {
    const cumulated = {tags: [], versions: []};
    const packages = [];

    await Promise.all(
        getPackages()
        .map(async ({exec, packageName}) => {
            const tags = await getTags(packageName, exec);

            packages.push({packageName, tags});

            tags
            .forEach(({tagName, packageVersion}) => {
                if( ! cumulated.tags.includes(tagName) ) {
                    cumulated.tags.push(tagName);
                }
                if( ! cumulated.versions.includes(packageVersion) ) {
                    cumulated.versions.push(packageVersion);
                }
            });
        })
    )

    return {cumulated, packages};
}

async function getTags(packageName, exec) {
    const {stdout} = await exec('npm', ['dist-tag', 'ls', packageName]);
    assert(stdout);
    const tags = stdout.split('\n');
    return (
        tags.map(tagLine => {
            const [tagName, packageVersion] = tagLine.split(': ');
            assert(tagName && packageVersion, stdout);
            assert(!/\s/.test(tagName), stdout);
            assert(!/\s/.test(packageVersion), stdout);
            return {tagName, packageVersion};
        })
    );
}
