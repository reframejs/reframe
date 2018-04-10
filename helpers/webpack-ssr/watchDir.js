const chokidar = require('chokidar');

module.exports = watchDir;

function watchDir(dirPath, listener) {
    if( isProduction() ) {
        return;
    }
    if( ! dirPath ) {
        return;
    }
    const watcher = chokidar.watch(dirPath, {ignoreInitial: true});

    const cb = () => {
        if( global.DEBUG_WATCH ) {
            console.log('REBUILD-REASON: new/removed file at `'+dirPath+'`');
        }
        listener();
    };

    watcher.on('add', cb);
    watcher.on('unlink', cb);
}

function isProduction() {
   return process.env.NODE_ENV === 'production';
}
