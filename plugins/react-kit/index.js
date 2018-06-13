module.exports = {
    $name: require('./package.json').name,
    $plugins: [
        require('@reframe/hapi'),
        require('@reframe/server'),
        require('@reframe/browser'),
        require('@reframe/react'),
        require('@reframe/build'),
        require('@reframe/project-files'),
        require('@reframe/path-to-regexp'),
        require('@reframe/start'),
        require('@reframe/deploy-git'),
        require('@reframe/eject'),
    ],
};
