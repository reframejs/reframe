const {createServer} = require('./createServer');
const chalk = require('chalk');
const assert = require('reassert');
const assert_usage = assert;

module.exports = {startServer};

async function startServer(pagesDir) {
    assert_usage(
        pagesDir
    );

    const server = await createServer({pagesDir});

    // todo add api example route
    //server.route

    await server.start();

    console.log(green_checkmark()+` Server running at ${server.info.uri}`);
}

function green_checkmark() {
    return chalk.green('\u2714');
}
