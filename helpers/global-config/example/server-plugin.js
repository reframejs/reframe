module.exports = {
    serverPort: 3000,
    routes: [
        {url: '/', body: '<div>Landing Page</div>'},
    ],
    $name: 'server-plugin',
    $getters: [
        {
            prop: 'serverPort',
            getter: configs => {
                const config = configs.find(conf => conf.serverPort);
                return config && config.serverPort;
            },
        },
        {
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
        },
    ],
};
