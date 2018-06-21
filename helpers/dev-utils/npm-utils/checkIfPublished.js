const getNpmTags = require('./getNpmTags');
const {symbolSuccess, colorError, indent, colorEmphasis} = require('@brillout/cli-theme');

checkIfPublished();

async function checkIfPublished() {
    const {cumulated, packages} = await getNpmTags();

    const referencePackage = packages[0];
    const referenceTags = referencePackage.tags;

    let hasError = false;

    packages
    .forEach(({packageName, tags}) => {
        if( !hasEqualTags(tags, referenceTags) ){
            hasError = true;
            console.log(colorError("The two packages "+packageName+" and "+referencePackage.packageName+" have different tags:")),
            console.log(tags);
            console.log(referenceTags);
            console.log();
        }
    });

    if( ! hasError ) {
        console.log(symbolSuccess+'All packages have the same tags:');
        console.log(
            referenceTags
            .map(({tagName, packageVersion}) =>
                indent+indent+colorEmphasis(tagName)+' '+packageVersion
            ).join('\n')
        );
    }
}

function hasEqualTags(tags1, tags2) {
    if( tags1.length !== tags2.length ) {
        return false;
    }
    for(tag1 of tags1) {
        if( ! tags2.find(tag2 => tag1.tagName === tag2.tagName && tag1.packageVersion === tag2.packageVersion) ) {
            return false;
        }
    }
    return true;
}
