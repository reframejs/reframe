process.on('unhandledRejection', err => {throw err});

const {createServer} = require('@reframe/core/server');
const chalk = require('chalk');
const path = require('path');

(async () => {
    const server = await createServer({
        pagesDir: path.join(__dirname, '../cli/pages'),
    });

    await server.start();

    console.log(green_checkmark()+` Server running at ${server.info.uri}`);
})();

function green_checkmark() {
    return chalk.green('\u2714');
}
