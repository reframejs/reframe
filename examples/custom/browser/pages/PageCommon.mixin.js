const PageCommon = {
    title: 'My Web App',
    description: 'This Web App helps you with everything',
    htmlStatic: true,
    browserEntry: './PageCommon.entry.js',
    scripts: [
        {
            async: true,
            src: 'https://www.google-analytics.com/analytics.js',
        },
    ],
};

export default PageCommon;
