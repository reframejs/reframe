// `chokidar-socket-emitter` seems to be the only GitHub repo using `socket.io` and `chokidar`;
//  - https://github.com/search?utf8=%E2%9C%93&q=chokidar+socket.io+path%3Apackage.json&type=Repositories

const chokidar = require('chokidar');
const parent_module = require('parent-module');
const path_module = require('path');
const reloadBrowser = require('./reloadBrowser');

module.exports = watchDir;

function watchDir(path) {
    const path_absolute = (
        path.startsWith('/') ? (
            path
        ) : (
            path_module.join(path_module.dirname(parent_module()), path)
        )
    );
    chokidar.watch(path_absolute).on('all', () => {
        reloadBrowser();
    });
}

