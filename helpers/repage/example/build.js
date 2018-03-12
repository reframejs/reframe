process.on('unhandledRejection', err => {throw err});

const {getStaticPages} = require('@repage/build');

const repage = require('./common');

(async () => {
    const htmlStaticPages = await getStaticPages(repage);
    console.log(JSON.stringify(htmlStaticPages, null, 2));
})();
