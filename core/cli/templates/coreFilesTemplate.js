module.exports = {jsonPkgTemplate, reframeConfigTemplate};

function jsonPkgTemplate(projectName) {
    let template =
`{
    "name": "${projectName}",
    "dependencies": {
        "react": "^16.2.0"
    },
    "private": true
}
`;

    return template;
}

function reframeConfigTemplate() {
    let template =
`module.exports = {};
`

    return template;
}