process.on('unhandledRejection', err => {throw err});

const {createServer} = require('@reframe/core/server');
const path = require('path');

(async () => {
    const server = await createServer({
        pagesDir: path.join(__dirname, '../pages'),
        log: true,
    });

    // todo add api example route
    //server.route

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
})();
