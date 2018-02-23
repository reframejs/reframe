module.exports = {jsonPkgTemplate};

function jsonPkgTemplate(projectName) {
    let template =
`{
    "name": "${projectName}",
    "dependencies": {
        "react": "^16.2.0"
    },
    "private": true
}`;

    return template;
}