module.exports = {jsonPkgTemplate, reframeConfigTemplate};

function jsonPkgTemplate(projectName) {
    const pkg = require('../package.json');
    const {version} = pkg;

    const template = (
`{
    "name": "${projectName}",
    "dependencies": {
        "@reframe/build": "^${version}",
        "@reframe/server": "^${version}",
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
