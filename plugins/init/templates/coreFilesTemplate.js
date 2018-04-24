module.exports = {jsonPkgTemplate, reframeConfigTemplate};

function jsonPkgTemplate() {
    const pkg = require('../package.json');
    const {version} = pkg;

    const template = (
`{
    "dependencies": {
        "@reframe/react-kit": "^${version}",
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
