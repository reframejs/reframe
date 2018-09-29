module.exports = {
    $name: require('./package.json').name,
    $plugins: [
        require('@reframe/hapi'),
        require('@reframe/server'),
        require('@reframe/browser'),
        require('@reframe/react'),
        require('@reframe/project-files'),
        require('@reframe/path-to-regexp'),
        require('@reframe/start'),
        require('@reframe/eject'),
        require('@reframe/build'),
    ],
};
