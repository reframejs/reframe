const config = require('..');

config.$addConfig({
    $name: 'server-plugin',
    serverPort: 3000,
});

config.$addGetter({
    prop: 'serverPort',
    getter: configs => {
        const config = configs.slice().reverse().find(conf => conf.serverPort);
        return config && config.serverPort;
    },
});

config.$addGetter({
    prop: 'routes',
    getter: configs => {
        const routes = [];
        configs
        .forEach(conf => {
            if( !conf.routes ) return;
            routes.push(...conf.routes);
        });
        return routes;
    },
});
