const githubPages = require('..');

module.exports = {
    plugins: [
        githubPages()
    ],
    githubPagesRepository: {
        remote: 'git@github.com:brillout/reframe-github-pages-test',
        branch: 'master', // optional, default is `master`
    },
};
