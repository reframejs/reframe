const Hapi = require('hapi');
const config = require('@brillout/reconfig').getConfig({configFileName: 'reframe.config.js'});
const {symbolSuccess, colorEmphasis} = require('@brillout/cli-theme');
const api = reuire('./api');

module.exports = start();

async function start() {
    const server = Hapi.Server({
        port: process.env.PORT || 3000,
        debug: {request: ['internal']},
    });

    // Run `$ reframe eject server-integration` to eject the integration plugin.
    await server.register(config.hapiIntegrationPlugin);

    await server.register(api);

    await server.start();

    const env = colorEmphasis(process.env.NODE_ENV||'development');
    console.log(symbolSuccess+'Server running (for '+env+')');

    return server;
}
/*

async function initConnection() {
    require("reflect-metadata");
    const {createConnection} = require("typeorm");
    const {User} = require("./entity/User");

    createConnection().then(async connection => {

        console.log("Inserting a new user into the database...");
        const user = new User();
        user.firstName = "Timber";
        user.lastName = "Saw";
        user.age = 25;
        await connection.manager.save(user);
        console.log("Saved a new user with id: " + user.id);
        
        console.log("Loading users from the database...");
        const users = await connection.manager.find(User);
        console.log("Loaded users: ", users);
         
        console.log("Here you can setup and run express/koa/any other framework.");
        
    }).catch(error => console.log(error));
}
*/
