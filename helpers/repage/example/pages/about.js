const title = 'About Page';

const body = `
    About this about page;
    <ul>
        <li>No JavaScript executed.</li>
        <li>Custom &gt;head&lt;.</li>
    </ul>
`;

const html = `
    <html>
        <head>
            <title>${title}</title>
        </head>
        <body>
            ${body}
        </body>
    </html>
`;

module.exports = {
    route: '/about',
    renderToHtml: () => html,
    renderToDom: () => {
        document.title = title;
        document.body.innerHTML = body;
    },
    htmlStatic: true,
};
