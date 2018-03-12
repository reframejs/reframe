const socket_io = require('socket.io');

module.exports = {reload_browser};

let sockets = {};

function reload_browser({port=3218}={}) {
    if( ! sockets[port] ) {
        const io = sockets[port] = socket_io();
        io.listen(port);
    }
    const io = sockets[port];
    io.emit('autoreload');
}
