module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ],
    buildRepository: {
        remote: 'git@github.com:brillout/reframe-github-pages-test',
        branch: 'master', // optional, default is `master`
    },
};
