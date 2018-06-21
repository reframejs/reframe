const getPackages = require('./getPackages');
const assert = require('reassert');
const {symbolSuccess, indent, colorEmphasis} = require('@brillout/cli-theme');

listTags();

function listTags() {
    const cumulated = {tags: [], versions: []};
    process.on(
        'exit',
        () => {
            console.log('Existing tags: '+cumulated.tags.map(s => colorEmphasis(s)).join(', ')+'.')
            console.log('Existing versions: '+cumulated.versions.map(s => colorEmphasis(s)).join(', ')+'.')
        }
    );

    getPackages()
    .forEach(async ({exec, packageName}) => {
        const tags = await getTags(packageName, exec);

        tags.forEach(({tagName, packageVersion}) => {
            if( ! cumulated.tags.includes(tagName) ) {
                cumulated.tags.push(tagName);
            }
            if( ! cumulated.versions.includes(packageVersion) ) {
                cumulated.versions.push(packageVersion);
            }
        });

        console.log(packageName);
        console.log(
            tags
            .map(({tagName, packageVersion}) =>
                indent+colorEmphasis(tagName)+' '+packageVersion
            ).join('\n')
        );
        console.log('');
    });
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
