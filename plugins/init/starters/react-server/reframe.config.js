module.exports = {
    $plugins: [
        require('@reframe/react-kit')
    ]

    // Make all pages be rendered to HTML at build-time
    defaultPageConfig: {
        renderPageAtBuildTime: true,
    },
};
