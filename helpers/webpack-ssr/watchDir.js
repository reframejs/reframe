const chokidar = require('chokidar');

module.exports = watchDir;

function watchDir(dirPath, listener) {
    if( isProduction() ) {
        return;
    }
    const watcher = chokidar.watch(dirPath, {ignoreInitial: true});
    watcher.on('add', () => {
        listener();
    });
    watcher.on('unlink', () => {
        listener();
    });
}

function isProduction() {
   return process.env.NODE_ENV === 'production';
}
