const PageCommon = {
    title: 'Jon Snow',
    description: 'This is the homepage of Jon Snow',
    htmlIsStatic: true,
    scripts: [
        {
            async: true,
            src: 'https://www.google-analytics.com/analytics.js',
        },
        {
            diskPath: './PageCommon.entry.js',
        },
    ],
};

export default PageCommon;
