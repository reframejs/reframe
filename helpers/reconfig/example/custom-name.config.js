module.exports = {
    serverPort: 8000,
    routes: [
        {url: '/about', body: '<div>About Page</div>'},
    ],
    $plugins: [
        require('./server-plugin'),
    ],
};
