module.exports = {
    $plugins: [
        require('@reframe/react-kit'),
        require('@reframe/deploy-git'),
    ],

    // Make all pages be rendered to HTML at build-time
    defaultPageConfig: {
        renderHtmlAtBuildTime: true,
    },

    buildRepository: {
     // Replace this with your repository
     // remote: 'git@github.com:username/repo',
        branch: 'dist',
    },
};
