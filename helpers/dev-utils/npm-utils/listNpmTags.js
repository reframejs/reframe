const getNpmTags = require('./getNpmTags');
const {symbolSuccess, indent, colorEmphasis} = require('@brillout/cli-theme');

listNpmTags();

async function listNpmTags() {
    const {cumulated, packages} = await getNpmTags();

    packages
    .forEach(({packageName, tags}) => {
        console.log(packageName);
        console.log(
            tags
            .map(({tagName, packageVersion}) =>
                indent+colorEmphasis(tagName)+' '+packageVersion
            ).join('\n')
        );
        console.log('');
    });

    console.log('Existing tags: '+cumulated.tags.map(s => colorEmphasis(s)).join(', ')+'.')
    console.log('Existing versions: '+cumulated.versions.map(s => colorEmphasis(s)).join(', ')+'.')
}
