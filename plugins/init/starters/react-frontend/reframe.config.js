module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/deploy-git'),
    ]

    // Make all pages be rendered to HTML at build-time
    defaultPageConfig: {
        renderPageAtBuildTime: true,
    },

    buildRepository: {
        remote: 'git@github.com:username/repo',
        branch: 'build',
    },
};
