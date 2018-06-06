module.exports = {
    $name: require('./package.json').name,
    $plugins: [
        require('@reframe/hapi'),
        require('@reframe/server'),
        require('@reframe/build'),
        require('@reframe/browser'),
        require('@reframe/project-files'),
        require('@reframe/react'),
        require('@reframe/path-to-regexp'),
        require('@reframe/start'),
        require('@reframe/github-pages'),
        require('@reframe/eject'),
    ],
};
