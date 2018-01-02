process.on('unhandledRejection', err => {throw err});

const {createServer} = require('@reframe/server');
const path = require('path');

(async () => {
    const server = await createServer({
        pagesDir: path.join(__dirname, '../pages'),
        log: true,
    });

    server.route({
        method: 'GET',
        path:'/custom-route',
        handler: function (request, h) {
            return 'This is a custom route. This could for example be an API endpoint.'
        }
    });

    await server.start();

    console.log(`Server running at ${server.info.uri}`);
})();
