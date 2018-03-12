process.on('unhandledRejection', err => {throw err});

const {getPageHtml} = require('@repage/server');

const repage = require('./common');

const incomingRequestsSimulation = [
    {req: {pathname: '/hello/jon'}},
];

(async () => {
    incomingRequestsSimulation.forEach(async ({req: {pathname}}) => {
        const pageHtml = await getPageHtml(repage, pathname);
        console.log(JSON.stringify(pageHtml, null, 2));
    });
})();
