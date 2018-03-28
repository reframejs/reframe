module.exports = {jsonPkgTemplate, reframeConfigTemplate};

function jsonPkgTemplate(projectName) {
    const assert_internal = require('reassert/internal');
    const pkg = require('../package.json');
    const {version} = pkg;
    assert_internal(version);

    const template = (
`{
    "name": "${projectName}",
    "dependencies": {
        "@reframe/run": "^${version}",
        "react": "^16.2.0"
    },
    "private": true
}
`
    );

    return template;
}

function reframeConfigTemplate() {
    const template = (
`module.exports = {};
`
    );

    return template;
}
