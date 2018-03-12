const PageCommon = {
    title: 'My Web App',
    description: 'This Web App helps you with ...',
    htmlStatic: true,
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
